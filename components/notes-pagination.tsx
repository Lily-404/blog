"use client"

import { useEffect, useRef } from "react"
import { useInfiniteNotes } from "@/hooks/use-infinite-notes"
import { NoteCard } from "./note-card"
import { NoteSkeleton } from "@/components/note-skeleton"
import type { NotesPaginationProps } from "@/types/notes"

export function NotesPagination({ 
  initialNotes, 
  initialPage,
  totalPages
}: NotesPaginationProps) {
  const { notes, loading, error, hasMore, loadMore, retry } = useInfiniteNotes({
    initialNotes,
    initialPage,
    totalPages,
    pageSize: 10,
  })

  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || !observerTarget.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    )

    observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  return (
    <div className="relative min-h-[400px]">
      <div className="space-y-3 pb-8">
        {notes.map((note, index) => (
          <NoteCard
            key={note.id}
            note={note}
            isLast={index === notes.length - 1}
          />
        ))}

        {loading && (
          <div>
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={retry}
              className="px-4 py-2 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
            >
              重试
            </button>
          </div>
        )}

        {!loading && notes.length === 0 && (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-16">
            还没有随笔内容...
          </p>
        )}

        {hasMore && (
          <div ref={observerTarget} className="h-16" />
        )}

        {!hasMore && notes.length > 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-600 py-4 text-sm">
            已经到底啦～
          </p>
        )}
      </div>
    </div>
  )
}