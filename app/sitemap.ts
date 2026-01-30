import type { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/app/lib/content'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.jimmy-blog.top'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMeta()
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/archive`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/notes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  return [...staticPages, ...postUrls]
}
