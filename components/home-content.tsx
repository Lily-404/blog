"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PostListItem } from "@/components/post-list-item"
import { PaginationButtons } from "@/components/ui/pagination-buttons"
import { Header } from "@/components/header"
import { Footer } from "@/components/ui/footer"
import { EmptyState } from "@/components/ui/empty-state"
import { useTagFilter } from "@/hooks/use-tag-filter"
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
  const { selectedTag, handleTagClick, tagElements } = useTagFilter(tags)

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
        <div className="mb-5">
          {tagElements}
        </div>
        {/* 文章列表 */}
        <div className="space-y-4 min-h-[100px]">
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post, index) => (
              <PostListItem
                key={post.id}
                id={post.id}
                title={post.title}
                date={post.date}
                variant="default"
                isLast={index === paginatedPosts.length - 1}
              />
            ))
          ) : (
            <EmptyState message="暂无文章。" spacing="sm" />
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