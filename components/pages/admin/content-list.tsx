"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Edit2, Trash2, Loader2 } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
}

export function ContentList({
  contentType,
  posts = [],
  notes = [],
  onEdit,
  onDelete,
  loading = false,
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
      toast.success(`${contentType === "post" ? "文章" : "随笔"}删除成功`)
    } catch (error) {
      toast.error(`删除失败: ${error instanceof Error ? error.message : "未知错误"}`)
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

  if (loading) {
    return <LoadingSpinner message="加载中..." size="md" />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message={`暂无${contentType === "post" ? "文章" : "随笔"}`}
        spacing="md"
      />
    )
  }

  return (
    <>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group flex items-center justify-between p-4 rounded-lg border",
              "bg-white dark:bg-zinc-900",
              "border-zinc-200 dark:border-zinc-800",
              "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
              "transition-colors"
            )}
          >
            <div className="flex-1 min-w-0">
              {contentType === "post" ? (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {(item as Post).title}
                    </h3>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                    {(item as Note).content}
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item.id)}
                className="h-8 w-8 p-0"
                title="编辑"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(item.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除这个{contentType === "post" ? "文章" : "随笔"}吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeletingId(null)
              }}
              disabled={deleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  删除中...
                </>
              ) : (
                "确认删除"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
