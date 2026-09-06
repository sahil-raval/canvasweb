import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'edbqqkej'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const singletonTypes = new Set(['siteSettings'])

export default defineConfig({
  name: 'canvas-real-estate',
  title: 'Canvas Real Estate CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: '2026-01-01'})],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : actions,
  },
})
