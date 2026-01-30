import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { HomeContent } from "@/components/home-content"
import { getAllPostsMeta, getTagsFromPosts, getAllNotesMeta } from "@/app/lib/content"

// 懒加载日历组件 - 不需要 SSR，减少初始包大小
const CalendarHeatmapFloating = dynamic(
  () => import('@/components/calendar-heatmap-floating').then(mod => ({ default: mod.CalendarHeatmapFloating })),
  { ssr: false }
)

const PAGE_SIZE = 10

export const metadata: Metadata = {
  title: "Jimmy's Blog",
  description: '书写，思考，生活',
  openGraph: {
    title: 'Jimmy Blog',
    description: '书写，思考，生活',
  },
}

export const dynamic = 'force-static'
export const revalidate = false // 完全静态生成，禁用重新验证

export default function Home() {
  const posts = getAllPostsMeta()
  const notes = getAllNotesMeta()
  const tags = getTagsFromPosts(posts).map(t => ({ tag: t.tag, count: Number(t.count) }))
  const paginatedPosts = posts.slice(0, PAGE_SIZE)
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  return (
    <>
      {/* 悬浮日历热力图，可手动隐藏/显示 */}
      <CalendarHeatmapFloating posts={posts} notes={notes} />
      <HomeContent
        posts={paginatedPosts}
        allPosts={posts}
        tags={tags}
        currentPage={1}
        totalPages={totalPages}
      />
    </>
  )
}

