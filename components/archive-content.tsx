"use client"

import { useState, useCallback, useMemo } from "react"
import type { PostsByYear, Post } from "@/types/post"
import Link from "next/link"
import { Footer } from "@/components/ui/footer"
import { PostListItem } from "@/components/ui/post-list-item"
import { Header } from "@/components/header"
import { useTagFilter } from "@/hooks/use-tag-filter"
import type { ArchiveContentProps } from "@/types/archive"
import { format } from "date-fns"

function groupPostsByYear(posts: Post[]): PostsByYear {
  const grouped: PostsByYear = {}
  posts.forEach(post => {
    const year = new Date(post.date).getFullYear().toString()
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  })
  // 按年份排序每组
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })
  return grouped
}

export function ArchiveContent({ initialData }: ArchiveContentProps) {
  const { selectedTag, handleTagClick, tagElements } = useTagFilter(initialData.tags)

  // 标签筛选
  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      // 全部标签
      return Object.values(initialData.postsByYear).flat()
    }
    return Object.values(initialData.postsByYear).flat().filter(post => post.tags && post.tags.includes(selectedTag))
  }, [initialData.postsByYear, selectedTag])

  // 按年份分组
  const postsByYear = useMemo(() => groupPostsByYear(filteredPosts), [filteredPosts])

  // 文章列表渲染
  const postElements = useMemo(() => (
    <div className="space-y-6">
      {Object.entries(postsByYear).length > 0 ? (
        Object.entries(postsByYear)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, posts]) => (
          <div key={year} className="space-y-4">
            <h2 className="text-2xl font-bold">{year}</h2>
            <div className="space-y-2">
              {posts.map((post) => (
                <PostListItem
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  date={post.date}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          暂无文章。
        </p>
      )}
    </div>
  ), [postsByYear])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header showBackButton={true} title="归档" />
      <main>
        {/* 标签云区域 */}
        {initialData.tags.length > 0 && (
          <div className="mb-5">
            {tagElements}
          </div>
        )}
        {/* 文章列表 */}
        {postElements}
      </main>
      <Footer />
    </div>
  )
}