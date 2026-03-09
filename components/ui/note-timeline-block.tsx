"use client"

import type { ReactNode } from "react"
import { useState, isValidElement, cloneElement } from "react"
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
  const [avatarLoaded, setAvatarLoaded] = useState(false)

  // 如果 avatar 是一个 React 元素（例如 OptimizedImage），给它注入 onLoad，
  // 这样只有头像加载完成后，我们才显示时间线的竖线
  const enhancedAvatar = isValidElement(avatar)
    ? cloneElement(avatar, {
        onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
          setAvatarLoaded(true)
          // 保留原有 onLoad 行为（如果有）
          // @ts-ignore
          avatar.props?.onLoad?.(e)
        },
      })
    : avatar
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
      <div className={cn("group relative", !isLast && "pb-6", className)}>
      {!isLast && avatarLoaded && (
        <div className="absolute left-5 top-0 w-px bottom-[-12px] bg-zinc-200 dark:bg-zinc-700 animate-in fade-in duration-500" />
      )}
      <div className="relative flex items-stretch gap-3">
        <div className="relative flex-shrink-0">{enhancedAvatar}</div>
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
