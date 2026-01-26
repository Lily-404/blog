"use client"

import { useEffect, useRef } from "react"
import { useInfiniteNotes } from "@/hooks/use-infinite-notes"
import { NoteCard } from "@/components/note-card"
import { NoteSkeleton } from "@/components/note-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
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
            <Button variant="secondary" size="sm" onClick={retry}>
              重试
            </Button>
          </div>
        )}

        {!loading && notes.length === 0 && (
          <EmptyState
            message="还没有随笔内容..."
            spacing="lg"
          />
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