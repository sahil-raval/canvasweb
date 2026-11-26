import {notFound} from 'next/navigation'
import JournalPost from '@/views/JournalPost'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {articleMetadata, articleSchema, breadcrumbSchema} from '@/lib/seo'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  return (await getContent()).articles.map((a) => ({slug: a.slug}))
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const article = content.articles.find((a) => a.slug === slug)
  return article ? articleMetadata(content, article) : {}
}

export default async function Page({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const article = content.articles.find((a) => a.slug === slug)
  if (!article) notFound()
  return (
    <>
      <CmsProvider content={scope(content, {articles: content.articles.map((a) => (a.slug === slug ? a : {...a, body: []})), agents: content.agents})}>
        <JournalPost />
      </CmsProvider>
      <JsonLd data={[articleSchema(content, article), breadcrumbSchema(content, [['Journal', '/journal'], [article.title, `/journal/${article.slug}`]])]} />
    </>
  )
}
