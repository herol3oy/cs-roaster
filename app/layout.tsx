import './globals.scss'

import type { Metadata } from 'next'
import { Suspense } from 'react'

import { LoadingSpinner } from '@/app/components/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Couchsurgin Roaster',
  description: 'Let AI roast your couchsurfing friend',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-theme='dark'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Couchsurfing Roaster</title>
      </head>
      <body>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </body>
    </html>
  )
}
