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

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const content = await getContent()
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[#371628]">
          Skip to content
        </a>
        <CmsProvider content={content}>
          <SiteShell>{children}</SiteShell>
        </CmsProvider>
        <JsonLd data={[businessSchema(content), websiteSchema(content)]} />
      </body>
    </html>
  )
}
