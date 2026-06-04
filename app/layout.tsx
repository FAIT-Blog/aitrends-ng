import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AITrends.ng — Africa\'s AI news, today and next',
  description:
    "Africa's autonomous briefing on AI — the latest news, trends, and what it means for builders in Nigeria and across the continent.",
  metadataBase: new URL('https://aitrends-ng.vercel.app'),
  openGraph: {
    siteName: 'AITrends.ng',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
