import { getAllPostIds, getPostById, getAllPostsMeta, getAllNotesMeta } from "@/app/lib/content"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Footer } from "@/components/ui/footer"
import { Layout } from "@/components/layout"
import { Tags } from "@/components/ui/tag"
import { Header } from "@/components/header"
import { MarkdownContent } from "@/components/markdown-content"
import { CalendarHeatmapFloating } from "@/components/calendar-heatmap-floating"
import { TableOfContents } from "@/components/ui/table-of-contents"
import { Metadata } from 'next'

// 设置为完全静态生成
export const dynamic = 'force-static'
export const revalidate = false // 禁用重新验证，因为数据只在部署时更新

// 生成所有可能的文章路径
export async function generateStaticParams() {
  return getAllPostIds()
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(id)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const description = post.contentHtml.replace(/<[^>]*>/g, '').slice(0, 200)
  const url = `https://www.jimmy-blog.top/posts/${id}`

  return {
    title: post.title,
    description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Jimmy'],
      tags: post.tags,
      url,
      siteName: 'Jimmy Blog',
      locale: 'zh_CN',
      images: [
        {
          url: 'https://www.jimmy-blog.top/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: ['https://www.jimmy-blog.top/og-image.png'],
    },
  }
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  if (!id) {
    notFound()
  }

  try {
    const post = await getPostById(id)

    if (!post) {
      notFound()
    }

    const posts = getAllPostsMeta()
    const notes = getAllNotesMeta()

    return (
      <Layout>
        <CalendarHeatmapFloating posts={posts} notes={notes} />
        {/* 右侧导航：不改变正文宽度与位置（脱离文档流） */}
        <aside className="hidden lg:block fixed right-24 top-24 w-56 z-40">
          <TableOfContents html={post.contentHtml} />
        </aside>

        <div className="max-w-2xl mx-auto px-4 py-6">
          <Header showBackButton={true} />

          <article>
            <header>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <time className="block text-xs text-zinc-400 dark:text-zinc-500">{formatDate(post.date)}</time>
              {post.tags && post.tags.length > 0 && (
                <Tags tags={post.tags} className="mt-2" interactive={false} />
              )}
            </header>
            <MarkdownContent content={post.contentHtml} />
          </article>

          <Footer />
        </div>
      </Layout>
    )
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}

