"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import { NoteCard } from "./note-card"
import { NoteSkeleton } from "@/components/note-skeleton"
import type { NotesPaginationProps } from "@/types/notes"

export function NotesPagination({ 
  initialNotes, 
  initialPage,
  totalPages
}: NotesPaginationProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPage < totalPages)
  const [error, setError] = useState<string | null>(null)

  const observerTarget = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const loadedPages = useRef(new Set<number>([initialPage]))

  const preloadNextPage = useCallback(async () => {
    const nextPage = page + 1
    if (nextPage >= totalPages || loadedPages.current.has(nextPage)) return

    try {
      await getPaginatedNotesAction(nextPage, 10)
    } catch {
    }
  }, [page, totalPages])

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMore || loadedPages.current.has(page + 1)) return

    loadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const { notes: newNotes } = await getPaginatedNotesAction(page + 1, 10)

      setNotes(prev => {
        const seen = new Set(prev.map(n => n.id))
        const unique = [...prev, ...newNotes.filter(n => !seen.has(n.id))]
        return unique
      })

      const newPage = page + 1
      setPage(newPage)
      loadedPages.current.add(newPage)
      setHasMore(newPage < totalPages)

      if (newPage < totalPages) {
        preloadNextPage()
      }
    } catch (err) {
      setError("加载失败，请重试")
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [page, hasMore, totalPages, preloadNextPage])

  useEffect(() => {
    if (!hasMore || !observerTarget.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage()
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    )

    observer.observe(observerTarget.current)

    return () => observer.disconnect()
  }, [hasMore, loadNextPage])

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
        <>
          <div>
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
          </div>
        </>
      )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadNextPage}
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