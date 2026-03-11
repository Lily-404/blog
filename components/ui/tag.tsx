"use client"

import { cn } from "@/lib/utils"

export interface TagProps {
  /** 标签文本 */
  tag: string
  /** 点击事件（用于交互模式） */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
  /** 是否可交互（按钮模式） */
  interactive?: boolean
  /** 是否选中（用于交互模式） */
  selected?: boolean
  /** 标签数量（可选） */
  count?: number
}

// 基础样式
const BASE_STYLES = [
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-normal",
  "bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm",
  "text-zinc-600 dark:text-zinc-300",
  "hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60",
  "transition-colors duration-200",
  "border border-zinc-200/50 dark:border-zinc-700/50",
  "hover:border-zinc-300/60 dark:hover:border-zinc-600/60",
  "hover:shadow-sm dark:hover:shadow-zinc-800/50",
] as const

// 选中状态样式：参考分页按钮的激活色系，再稍微提亮一点
const SELECTED_STYLES = [
  // 亮色：更亮一点的深灰背景 + 纯白文字
  "bg-zinc-900 text-white",
  "border border-zinc-600",
  "hover:bg-zinc-800 hover:border-zinc-500",
  // 暗色：更亮一点的浅灰背景 + 深文字
  "dark:bg-zinc-100 dark:text-zinc-900",
  "dark:border-zinc-400",
  "dark:hover:bg-zinc-200 dark:hover:border-zinc-500",
  // 轻微阴影，和分页按钮的浮起感接近
  "shadow-sm dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.5)]",
] as const

// 数量样式
const COUNT_UNSELECTED_STYLES = "text-zinc-400 dark:text-zinc-500"
const COUNT_SELECTED_STYLES = "text-white dark:text-black"

/**
 * 标签组件
 * 支持普通显示和交互模式（可点击、可选中、可显示数量）
 */
export function Tag({
  tag,
  onClick,
  className,
  interactive = false,
  selected = false,
  count,
}: TagProps) {
  const baseClasses = cn(
    BASE_STYLES,
    selected && SELECTED_STYLES,
    className
  )

  const content = (
    <>
      <span>{tag}</span>
      {count != null && (
        <span
          className={cn(
            "ml-1",
            selected ? COUNT_SELECTED_STYLES : COUNT_UNSELECTED_STYLES
          )}
        >
          {count}
        </span>
      )}
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        aria-pressed={selected}
      >
        {content}
      </button>
    )
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  )
}

export interface TagsProps {
  /** 标签列表 */
  tags: string[]
  /** 自定义类名 */
  className?: string
  /** 标签点击事件 */
  onTagClick?: (tag: string) => void
  /** 是否可交互 */
  interactive?: boolean
  /** 选中的标签列表 */
  selectedTags?: string[]
}

/**
 * 标签组组件
 * 用于渲染多个标签
 */
export function Tags({
  tags,
  className,
  onTagClick,
  interactive = false,
  selectedTags = [],
}: TagsProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          tag={tag}
          onClick={() => onTagClick?.(tag)}
          interactive={interactive}
          selected={selectedTags.includes(tag)}
        />
      ))}
    </div>
  )
}
