import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const siteUrl = 'https://viryaevents.example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Virya Events — Premium Event Planning & Management',
    template: '%s | Virya Events',
  },
  description:
    'Virya Events is a premium event planning and management company. Birthdays, corporate events, housewarming ceremonies and private celebrations — planned, coordinated and executed with clarity.',
  keywords: [
    'event management',
    'event planning',
    'birthday party planner',
    'corporate events',
    'housewarming ceremony',
    'private celebrations',
    'Bengaluru event planner',
    'Virya Events',
  ],
  authors: [{ name: 'Virya Events' }],
  creator: 'Virya Events',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Virya Events',
    title: 'Virya Events — Every Celebration Deserves to Be Remembered.',
    description:
      'Professional event planning and management for birthdays, corporate events, housewarming ceremonies and private celebrations.',
    images: [
      {
        url: '/images/hero-event.png',
        width: 1200,
        height: 630,
        alt: 'A beautifully decorated premium celebration venue',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virya Events — Every Celebration Deserves to Be Remembered.',
    description:
      'Professional event planning and management for birthdays, corporate events, housewarming ceremonies and private celebrations.',
    images: ['/images/hero-event.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app',
  icons: {
  icon: '/favicon.ico',
  apple: '/apple-icon.png',
},
}


export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f5f2',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Virya Events',
  description:
    'Premium event planning and management for birthdays, corporate events, housewarming ceremonies and private celebrations.',
  image: `${siteUrl}/images/hero-event.png`,
  url: siteUrl,
  telephone: '+91-98765-43210',
  email: 'hello@viryaevents.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  areaServed: 'Bengaluru and surrounding regions',
  slogan: 'Every Celebration Deserves to Be Remembered.',
  priceRange: '₹₹',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
