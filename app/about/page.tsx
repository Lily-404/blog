import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AboutContent } from "@/components/about-content"
import { getAllPosts, getAllNotesMeta, getAllPostsMeta } from "@/app/lib/content"

// 懒加载日历组件 - 不需要 SSR
const CalendarHeatmapFloating = dynamic(
  () => import('@/components/calendar-heatmap-floating').then(mod => ({ default: mod.CalendarHeatmapFloating })),
  { ssr: false }
)

export const dynamic = 'force-static'
export const revalidate = false // 禁用重新验证，因为内容是静态的

export const metadata: Metadata = {
  title: '关于',
  description: '关于 Jimmy 的个人介绍和联系方式',
  openGraph: {
    title: '关于 | Jimmy Blog',
    description: '关于 Jimmy 的个人介绍和联系方式',
  },
}

export default function AboutPage() {
  const posts = getAllPosts()
  const notes = getAllNotesMeta()
  const postsMeta = getAllPostsMeta()
  const tags = new Set(posts.flatMap(post => post.tags || []))
  return (
    <>
      <CalendarHeatmapFloating posts={postsMeta} notes={notes} />
      <AboutContent initialStats={{
        posts: posts.length,
        notes: notes.length,
        tags: tags.size
      }} />
    </>
  )
}

