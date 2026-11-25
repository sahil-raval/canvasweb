'use client'

import {createContext, useContext, type ReactNode} from 'react'
import type {CmsContent} from './types'

const CmsContext = createContext<CmsContent | null>(null)

/** Content is loaded on the server and passed down once, so pages render with real data in the HTML. */
export function CmsProvider({content, children}: {content: CmsContent; children: ReactNode}) {
  return <CmsContext.Provider value={content}>{children}</CmsContext.Provider>
}

export function useCms(): CmsContent {
  const value = useContext(CmsContext)
  if (!value) throw new Error('useCms must be used inside <CmsProvider>')
  return value
}
