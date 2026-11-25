import type {Metadata, Viewport} from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/playfair-display'
import './globals.css'
import {JsonLd} from '@/components/JsonLd'
import {SiteShell} from '@/components/SiteShell'
import {SITE_URL} from '@/lib/cms/config'
import {CmsProvider} from '@/lib/cms/context'
import {getContent} from '@/lib/cms/fetch'
import {businessSchema, websiteSchema} from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const {siteSettings} = await getContent()
  return {
    metadataBase: new URL(siteSettings.siteUrl || SITE_URL),
    applicationName: siteSettings.businessName,
    authors: [{name: siteSettings.businessName}],
    icons: {icon: '/favicon.svg'},
    formatDetection: {telephone: true, address: true, email: true},
    other: {'geo.region': 'AU-VIC', 'geo.placename': 'Geelong'},
  }
}

export const viewport: Viewport = {themeColor: '#371628', width: 'device-width', initialScale: 1}

// Runs before first paint: mark the first page of a visit so the intro shows without a flash.
const introScript = `try{if(!sessionStorage.getItem('cre-loaded'))document.documentElement.classList.add('intro')}catch(e){}`

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const content = await getContent()
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: introScript}} />
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <CmsProvider content={content}>
          <SiteShell>{children}</SiteShell>
        </CmsProvider>
        <JsonLd data={[businessSchema(content), websiteSchema(content)]} />
      </body>
    </html>
  )
}
