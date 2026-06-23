import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'AITrends.ng — Africa\'s AI news, today and next',
  description: "AITrends.ng — insights, and lessons for the future.",
  metadataBase: new URL('https://www.aitrends.ng'),
  alternates: { canonical: 'https://www.aitrends.ng' },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: 'AITrends.ng',
    type: 'website',
    url: 'https://www.aitrends.ng',
    title: 'AITrends.ng — Africa\'s AI news, today and next',
    description: "AITrends.ng — insights, and lessons for the future.",
    images: [{ url: 'https://www.aitrends.ng/og-default.png', width: 1200, height: 630, alt: 'AITrends.ng — Africa\'s AI news' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aitrends_ng',
    title: 'AITrends.ng — Africa\'s AI news, today and next',
    description: "AITrends.ng — insights, and lessons for the future.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
