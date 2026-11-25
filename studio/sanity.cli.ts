import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  project: {basePath: '/studio'},
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'edbqqkej',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  typegen: {
    enabled: true,
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/lib/cms/sanity.types.ts',
    overloadClientMethods: true,
  },
})
