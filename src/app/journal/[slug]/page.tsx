import {notFound} from 'next/navigation'
import JournalPost from '@/views/JournalPost'
import {AnswerBox} from '@/components/AnswerBox'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {articleMetadata, articleSchema, breadcrumbSchema, webPageSchema} from '@/lib/seo'

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
      <CmsProvider content={scope(content, {articles: content.articles.map((a) => (a.slug === slug ? a : {...a, body: []})), agents: content.agents, pages: pagesFor(content, 'journal')})}>
        <JournalPost />
      </CmsProvider>
      <AnswerBox seo={article.seo} />
      <JsonLd data={[webPageSchema(content, {path: `/journal/${article.slug}`, name: article.title, seo: article.seo}), articleSchema(content, article), breadcrumbSchema(content, [['Journal', '/journal'], [article.title, `/journal/${article.slug}`]])].filter((x): x is Record<string, unknown> => !!x)} />
    </>
  )
}
