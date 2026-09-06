import {CogIcon} from '@sanity/icons/Cog'
import {DocumentIcon} from '@sanity/icons/Document'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {UserIcon} from '@sanity/icons/User'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Canvas Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
      S.divider(),
      S.listItem()
        .title('Properties')
        .icon(DocumentIcon)
        .child(
          S.list().title('Properties').items([
            S.documentTypeListItem('listing').title('For Sale'),
            S.documentTypeListItem('rental').title('For Rent'),
          ]),
        ),
      S.documentTypeListItem('journalArticle').title('Journal').icon(DocumentTextIcon),
      S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
      S.documentTypeListItem('agent').title('Agents').icon(UserIcon),
    ])
