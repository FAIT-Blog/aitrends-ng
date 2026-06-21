import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'AITrends.ng — Africa\'s AI news, today and next',
  description:
    "Africa's autonomous briefing on AI — the latest news, trends, and what it means for builders in Nigeria and across the continent.",
  metadataBase: new URL('https://www.aitrends.ng'),
  alternates: { canonical: 'https://www.aitrends.ng' },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: 'AITrends.ng',
    type: 'website',
    url: 'https://www.aitrends.ng',
    title: 'AITrends.ng — Africa\'s AI news, today and next',
    description: "Africa's autonomous briefing on AI — news, trends, and what it means for builders in Nigeria and across the continent.",
    images: [{ url: 'https://www.aitrends.ng/og-default.png', width: 1200, height: 630, alt: 'AITrends.ng — Africa\'s AI news' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aitrends_ng',
    title: 'AITrends.ng — Africa\'s AI news, today and next',
    description: "Africa's autonomous briefing on AI — news, trends, and what it means for builders in Nigeria.",
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
