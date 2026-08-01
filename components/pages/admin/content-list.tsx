"use client"

import { useState } from "react"
import { toast } from "sonner"
import { LoadingState } from "@/components/ui/loading-state"

interface Post {
  id: string
  title: string
  date: string
  tags: string[]
}

interface Note {
  id: string
  date: string
  content: string
}

interface ContentListProps {
  contentType: "post" | "note"
  posts?: Post[]
  notes?: Note[]
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
  loading?: boolean
  /** 正在加载某条内容（点击编辑后） */
  editingLoading?: boolean
}

export function ContentList({
  contentType,
  posts = [],
  notes = [],
  onEdit,
  onDelete,
  loading = false,
  editingLoading = false,
}: ContentListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const items = contentType === "post" ? posts : notes

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return

    setDeleting(true)
    try {
      await onDelete(deletingId)
      setDeleteDialogOpen(false)
      setDeletingId(null)
      toast.success(contentType === "post" ? "已删除文章" : "已删除随笔")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败")
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  if (loading || editingLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingState
          label={editingLoading ? "加载内容" : "加载列表"}
          variant="Drive"
        />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="nd-label mb-2">暂无内容</p>
        <p className="nd-caption">
          暂无{contentType === "post" ? "文章" : "随笔"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border-t border-[var(--nd-border)]">
        {items.map((item) => (
          <div key={item.id} className="nd-row group">
            <button
              type="button"
              onClick={() => onEdit(item.id)}
              className="flex-1 min-w-0 text-left bg-transparent border-0 p-0 cursor-pointer"
            >
              {contentType === "post" ? (
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[16px] text-[var(--nd-text-primary)] truncate group-hover:text-[var(--nd-text-display)] transition-colors duration-200">
                    {(item as Post).title}
                  </h3>
                  <span className="nd-caption flex-shrink-0 tabular-nums">
                    {formatDate(item.date)}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] text-[var(--nd-text-primary)] line-clamp-2 min-w-0 flex-1 group-hover:text-[var(--nd-text-display)] transition-colors duration-200">
                    {(item as Note).content}
                  </p>
                  <span className="nd-caption flex-shrink-0 tabular-nums">
                    {formatDate(item.date)}
                  </span>
                </div>
              )}
            </button>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={() => onEdit(item.id)}
                className="nd-btn nd-btn-ghost !min-h-[32px] !px-2 !text-[11px]"
              >
                编辑
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(item.id)}
                className="nd-btn nd-btn-ghost !min-h-[32px] !px-2 !text-[11px] !text-[var(--nd-accent)]"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 nd-modal-backdrop"
          onClick={() => {
            if (deleting) return
            setDeleteDialogOpen(false)
            setDeletingId(null)
          }}
        >
          <div
            className="nd-modal w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="nd-label mb-2">确认</p>
                <h2 className="text-[18px] text-[var(--nd-text-display)]">
                  删除{contentType === "post" ? "文章" : "随笔"}
                </h2>
                <p className="nd-caption mt-2">
                  此操作无法撤销。确定继续？
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setDeletingId(null)
                }}
                className="nd-btn nd-btn-ghost !min-h-[32px] !px-2"
                disabled={deleting}
              >
                关闭
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setDeletingId(null)
                }}
                disabled={deleting}
                className="nd-btn nd-btn-secondary !min-h-[40px] !px-4 !py-2 !text-[11px]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="nd-btn nd-btn-destructive !min-h-[40px] !px-4 !py-2 !text-[11px]"
              >
                {deleting ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
