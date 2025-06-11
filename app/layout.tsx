import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' }
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Jimmy Blog',
    template: '%s | Jimmy Blog'
  },
  description: '书写，思考，生活',
  keywords: ['blog', 'technology', 'personal blog', 'next.js'],
  authors: [{ name: 'Jimmy' }],
  creator: 'Jimmy',
  publisher: 'Jimmy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.jimmy-blog.top'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.jimmy-blog.top',
    title: 'Jimmy Blog',
    description: '书写，思考，生活',
    siteName: 'Jimmy Blog',
    images: [
      {
        url: 'https://www.jimmy-blog.top/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jimmy Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jimmy Blog',
    description: '书写，思考，生活',
    images: ['https://www.jimmy-blog.top/og-image.png'],
  },
  icons: {
    icon: '/favorite.png',
    apple: '/favorite.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 antialiased`}>
        <ThemeProvider>
          {children}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'