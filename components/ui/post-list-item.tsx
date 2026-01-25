"use client"

import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"

export interface PostListItemProps {
  /** 文章 ID */
  id: string
  /** 文章标题 */
  title: string
  /** 文章日期 */
  date: string
  /** 布局变体 */
  variant?: "default" | "compact"
  /** 是否最后一项（用于移除底部边框） */
  isLast?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 文章列表项组件
 * 用于在首页、归档页等地方显示文章列表
 */
export function PostListItem({
  id,
  title,
  date,
  variant = "default",
  isLast = false,
  className,
}: PostListItemProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/posts/${id}`}
        className={cn(
          "flex items-center justify-between group",
          className
        )}
      >
        <span className="text-base font-normal group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200 truncate mr-4">
          {title}
        </span>
        <time className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0 font-mono tabular-nums">
          {format(new Date(date), "MM/dd")}
        </time>
      </Link>
    )
  }

  // default 变体
  return (
    <article
      className={cn(
        "border-b border-zinc-100 dark:border-zinc-800 pb-4",
        isLast && "border-b-0 pb-0",
        className
      )}
    >
      <Link href={`/posts/${id}`} className="group block">
        <h2 className="text-base font-normal text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
          {title}
        </h2>
        <time className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
          {format(new Date(date), "yyyy年MM月dd日", { locale: zhCN })}
        </time>
      </Link>
    </article>
  )
}
