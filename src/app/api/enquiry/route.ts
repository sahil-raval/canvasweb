/**
 * POST /api/enquiry — website enquiry forms (contact page, listing and rental pages).
 * Sends a notification to the office and an auto-reply to the sender via Resend.
 * Env: RESEND_API_KEY, ENQUIRY_FROM (verified sender), ENQUIRY_TO (defaults to the site email).
 */
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {z} from 'zod'
import {getContent} from '@/lib/cms/fetch'
import {rateLimited} from '@/lib/security'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  enquiryType: z.string().trim().max(80).optional().default('General enquiry'),
  message: z.string().trim().max(5000).optional().default(''),
  property: z.string().trim().max(300).optional().default(''),
  // Spam trap: a hidden field people never see. Bots that fill it are ignored.
  website: z.string().optional(),
})

const MAX_BODY_BYTES = 16_000

const esc = (s: string) =>
  s
    .replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]!)
    .replace(/\n/g, '<br>')

async function render(file: string, vars: Record<string, string>) {
  const html = await readFile(path.join(process.cwd(), 'email-templates', file), 'utf8')
  return html.replace(/{{(\w+)}}/g, (_, k: string) => esc(vars[k] ?? ''))
}

async function send(apiKey: string, body: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Email failed (${res.status})`)
}

export async function POST(req: Request) {
  // Only accept posts from this website's own pages.
  const origin = req.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(req.url).host) return Response.json({error: 'Not allowed.'}, {status: 403})
  if (rateLimited(req)) return Response.json({error: 'Too many messages. Please call us instead.'}, {status: 429})
  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) return Response.json({error: 'Message is too long.'}, {status: 413})
  let body: unknown = null
  try {
    body = JSON.parse(raw)
  } catch {}
  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({error: 'Please check your details and try again.'}, {status: 400})
  const d = parsed.data
  // Pretend success for bots so they do not retry.
  if (d.website) return Response.json({ok: true})

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ENQUIRY_FROM
  if (!apiKey || !from) {
    console.error('[enquiry] RESEND_API_KEY / ENQUIRY_FROM not set')
    return Response.json({error: 'Online enquiries are not available right now. Please call us.'}, {status: 503})
  }
  const {siteSettings} = await getContent()
  const to = process.env.ENQUIRY_TO || siteSettings.email || 'enquiry@canvasrealestate.com.au'
  const vars = {
    from_name: d.name,
    to_name: d.name.split(' ')[0],
    from_email: d.email,
    phone: d.phone || '-',
    enquiry_type: d.enquiryType,
    property: d.property || '-',
    message: d.message || '-',
    timestamp: new Date().toLocaleString('en-AU', {timeZone: 'Australia/Melbourne'}),
  }

  try {
    await send(apiKey, {
      from,
      to: [to],
      reply_to: d.email,
      subject: `New enquiry: ${d.enquiryType}${d.property ? ` - ${d.property}` : ''}`,
      html: await render('enquiry-notification.html', vars),
    })
    // The auto-reply is a courtesy; the enquiry still counts as sent if it fails.
    await send(apiKey, {
      from,
      to: [d.email],
      subject: 'Thanks for contacting Canvas Real Estate',
      html: await render('auto-reply.html', vars),
    }).catch((e) => console.error('[enquiry] auto-reply', e))
  } catch (e) {
    console.error('[enquiry]', e)
    return Response.json({error: 'We could not send your message. Please call us.'}, {status: 502})
  }
  return Response.json({ok: true})
}
