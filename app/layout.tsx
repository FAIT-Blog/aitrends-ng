import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AITrends.ng — AI news for African builders',
  description:
    "The African builder's daily briefing on Claude, Anthropic, and the models shaping what's next.",
  metadataBase: new URL('https://aitrends.ng'),
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
