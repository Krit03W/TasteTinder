import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TasteSwipe – Swipe to Trip',
  description: 'Discover Bangkok one swipe at a time',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-on-surface antialiased">
        <main className="min-h-dvh max-w-md mx-auto relative">
          {children}
        </main>
      </body>
    </html>
  )
}
