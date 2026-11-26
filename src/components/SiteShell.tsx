import type {ReactNode} from 'react'
import {Navbar} from '@/components/Navbar'
import {Footer} from '@/components/Footer'
import {Toaster} from '@/components/ui/toaster'

/** Header, page content and footer. Content is visible on first paint (no intro screen). */
export function SiteShell({children}: {children: ReactNode}) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main" className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  )
}
