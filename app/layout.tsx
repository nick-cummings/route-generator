import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { LanguageProvider } from './contexts/LanguageContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Route Generator',
  description:
    'Extract addresses from delivery screenshots and create optimized routes in Google Maps',
  keywords: 'route generator, delivery routes, address extraction, google maps, route optimization',
  authors: [{ name: 'Nick Cummings' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Route Generator',
    description: 'Extract addresses from delivery screenshots and create optimized routes',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
