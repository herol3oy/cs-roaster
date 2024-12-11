import './globals.scss'

import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'

import { LoadingSpinner } from '@/app/components/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Couchsurgin AI Assistant',
  description: 'Let AI roast your couchsurfing friend and create funny couch request for your next host!',
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
        <title>Couchsurfing AI Assistant</title>
      </head>
      <body>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        <Script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "9e940411ad44405ab302648fd7de578f"}'
        ></Script>
      </body>
    </html>
  )
}
