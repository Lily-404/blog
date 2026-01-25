import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface NoteTimelineBlockProps {
  avatar: ReactNode
  meta: ReactNode
  children: ReactNode
  isLast?: boolean
  variant?: "default" | "skeleton"
  className?: string
  contentClassName?: string
}

/** 随笔时间线布局：头像 + 作者/日期 + 内容，支持时间线连接线与 skeleton 变体 */
export function NoteTimelineBlock({
  avatar,
  meta,
  children,
  isLast = true,
  variant = "default",
  className,
  contentClassName,
}: NoteTimelineBlockProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("flex items-start gap-3 py-4 animate-pulse", className)}>
        <div className="flex-shrink-0">{avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-3">{meta}</div>
          <div className="space-y-2.5">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("group relative pb-6", className)}>
      {!isLast && (
        <div className="absolute left-5 top-0 w-0.5 bottom-[-12px] bg-zinc-200 dark:bg-zinc-700" />
      )}
      <div className="relative flex items-stretch gap-3">
        <div className="relative flex-shrink-0">{avatar}</div>
        <div className="flex-1 -mt-1">
          <div className="flex items-baseline gap-2">{meta}</div>
          <div
            className={cn(
              "mt-1 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 break-words",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/** 随笔头像统一样式 */
export const NOTE_AVATAR_CLASSES =
  "w-10 h-10 rounded-full object-cover border-[1px] border-zinc-100 dark:border-zinc-800 shadow-sm" as const
