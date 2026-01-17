import { useState, useCallback, useRef } from "react"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import type { NoteMeta } from "@/app/lib/content"

interface UseInfiniteNotesOptions {
  initialNotes: NoteMeta[]
  initialPage: number
  totalPages: number
  pageSize?: number
}

interface UseInfiniteNotesReturn {
  notes: NoteMeta[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  retry: () => Promise<void>
}

export function useInfiniteNotes({
  initialNotes,
  initialPage,
  totalPages,
  pageSize = 10,
}: UseInfiniteNotesOptions): UseInfiniteNotesReturn {
  const [notes, setNotes] = useState(initialNotes)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(initialPage < totalPages)
  
  // 使用 ref 防止重复加载
  const loadingRef = useRef(false)
  const loadedPagesRef = useRef(new Set<number>([initialPage]))

  const loadMore = useCallback(async () => {
    // 防止重复加载
    if (loadingRef.current || !hasMore) return
    
    const nextPage = page + 1
    if (loadedPagesRef.current.has(nextPage)) return

    loadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const { notes: newNotes } = await getPaginatedNotesAction(nextPage, pageSize)
      
      setNotes((prev) => {
        // 去重处理
        const seen = new Set(prev.map((n) => n.id))
        return [...prev, ...newNotes.filter((n) => !seen.has(n.id))]
      })

      setPage(nextPage)
      loadedPagesRef.current.add(nextPage)
      setHasMore(nextPage < totalPages)
    } catch (err) {
      setError("加载失败，请重试")
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [page, hasMore, totalPages, pageSize])

  const retry = useCallback(async () => {
    setError(null)
    await loadMore()
  }, [loadMore])

  return {
    notes,
    loading,
    error,
    hasMore,
    loadMore,
    retry,
  }
}
