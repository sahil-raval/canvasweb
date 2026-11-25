'use client'

import {useCallback, useEffect, useState, type ReactNode} from 'react'
import {Navbar} from '@/components/Navbar'
import {Footer} from '@/components/Footer'
import {Preloader} from '@/components/Preloader'
import {Toaster} from '@/components/ui/toaster'

/**
 * Header, footer and the intro animation. The intro only plays on the first page of a
 * visit; an inline script in the layout adds `html.intro` before paint so there is no flash.
 */
export function SiteShell({children}: {children: ReactNode}) {
  const [intro, setIntro] = useState(false)

  useEffect(() => {
    setIntro(document.documentElement.classList.contains('intro'))
  }, [])

  const done = useCallback(() => {
    try {
      sessionStorage.setItem('cre-loaded', '1')
    } catch {}
    document.documentElement.classList.remove('intro')
    setIntro(false)
  }, [])

  return (
    <>
      {intro && <Preloader onComplete={done} />}
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  )
}
