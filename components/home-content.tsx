"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tag } from "@/components/tag"
import { PaginationButtons } from "@/components/pagination-buttons"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatDate } from "@/lib/utils"
import { articleStyles } from "@/styles/article"

type HomeContentProps = {
  posts: any[];
  allPosts: any[];
  tags: { tag: string; count: number }[];
  currentPage: number;
  totalPages: number;
}

export function HomeContent({ posts, allPosts, tags, currentPage, totalPages }: HomeContentProps) {
  const router = useRouter()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return allPosts.filter((post) => post.tags.includes(selectedTag));
  }, [posts, allPosts, selectedTag]);

  // 标签筛选时只显示第一页
  const showCurrentPage = selectedTag ? 1 : currentPage;
  const showTotalPages = selectedTag ? 1 : totalPages;

  // 标签筛选后分页（仅标签筛选时前端分页）
  const PAGE_SIZE = 10;
  const paginatedPosts = useMemo(() => {
    if (!selectedTag) return filteredPosts;
    const start = (showCurrentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, selectedTag, showCurrentPage]);

  // 分页跳转
  const handlePageChange = (page: number) => {
    if (page === 1) {
      router.push("/")
    } else {
      router.push(`/page/${page}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header isHome={true} />
      <main className="min-h-[200px]">
        {/* 标签云区域 */}
        <div className="mb-5 flex flex-wrap gap-2">
          <Tag
            tag="全部"
            onClick={() => {
              setSelectedTag(null)
            }}
            interactive={true}
            className={selectedTag === null ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200" : ""}
          />
          {tags.map(({ tag }) => (
            <Tag
              key={tag}
              tag={tag}
              onClick={() => {
                setSelectedTag(tag)
              }}
              interactive={true}
              className={selectedTag === tag ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200" : ""}
            />
          ))}
        </div>
        {/* 文章列表 */}
        <div className="space-y-4 min-h-[100px]">
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post, index) => (
              <article 
                key={post.id} 
                className={`border-b border-zinc-100 dark:border-zinc-800 pb-4 ${index === paginatedPosts.length - 1 ? 'border-b-0 pb-0' : ''}`}
              >
                <Link href={`/posts/${post.id}`} className="group block">
                  <h2 className="text-base font-normal text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <time className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                    {formatDate(post.date)}
                  </time>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">暂无文章。</p>
          )}
        </div>
        {/* 分页控制 */}
        {showTotalPages > 1 && (
          <div className="mt-8">
            <PaginationButtons
              currentPage={showCurrentPage}
              totalPages={showTotalPages}
              onPageChange={handlePageChange}
              className="animate-in fade-in duration-300"
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}