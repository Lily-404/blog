"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 是否加载中 */
  loading?: boolean
  /** 是否编辑模式 */
  editing?: boolean
  /** 编辑时的文本，默认 "更新" */
  editText?: string
  /** 新建时的文本，默认 "发布" */
  createText?: string
  /** 加载中编辑时的文本，默认 "更新中..." */
  editingLoadingText?: string
  /** 加载中新建时的文本，默认 "发布中..." */
  creatingLoadingText?: string
}

const SUBMIT_BUTTON_BASE_STYLES = [
  "h-9 px-6 rounded-xl text-sm font-medium",
  "shadow-sm hover:shadow-md transition-all",
] as const

const SUBMIT_BUTTON_ENABLED_STYLES = [
  "bg-black dark:bg-white text-white dark:text-black",
  "border border-black dark:border-white",
] as const

const SUBMIT_BUTTON_DISABLED_STYLES = [
  "bg-zinc-400 dark:bg-zinc-600 text-white dark:text-zinc-200",
  "border border-zinc-400 dark:border-zinc-600",
  "cursor-not-allowed hover:shadow-sm",
] as const

/**
 * 提交按钮组件
 * 统一提交/更新按钮的样式和加载状态
 */
export function SubmitButton({
  loading = false,
  editing = false,
  editText = "更新",
  createText = "发布",
  editingLoadingText = "更新中...",
  creatingLoadingText = "发布中...",
  disabled,
  className,
  children,
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(
        SUBMIT_BUTTON_BASE_STYLES,
        isDisabled ? SUBMIT_BUTTON_DISABLED_STYLES : SUBMIT_BUTTON_ENABLED_STYLES,
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {editing ? editingLoadingText : creatingLoadingText}
        </span>
      ) : (
        children || (editing ? editText : createText)
      )}
    </button>
  )
}
