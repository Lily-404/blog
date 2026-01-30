import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.jimmy-blog.top'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
