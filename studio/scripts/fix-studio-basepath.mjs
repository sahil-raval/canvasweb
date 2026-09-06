import {readFile, writeFile} from 'node:fs/promises'

const indexUrl = new URL('../../web/dist/studio/index.html', import.meta.url)
const html = await readFile(indexUrl, 'utf8')
const normalized = html.replaceAll('href="/static/', 'href="/studio/static/')

if (!normalized.includes('src="/studio/static/')) {
  throw new Error('Studio script URLs are not using the /studio base path')
}

await writeFile(indexUrl, normalized)
