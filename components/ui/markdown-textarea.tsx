"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface MarkdownTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 是否在 split 模式下使用（影响高度样式） */
  splitMode?: boolean
  /** 最小高度，默认根据模式自动设置 */
  minHeight?: string | number
}

const MarkdownTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MarkdownTextareaProps
>(
  (
    {
      splitMode = false,
      minHeight,
      className,
      placeholder = "粘贴或输入 Markdown 内容...",
      ...props
    },
    ref
  ) => {
    const defaultMinHeight = minHeight ?? (splitMode ? "300px" : "600px")
    const heightClasses = splitMode
      ? "h-[300px] lg:h-[600px] min-h-[300px] lg:min-h-[600px] max-h-[300px] lg:max-h-[600px]"
      : ""

    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-5 py-4",
          "bg-transparent dark:bg-transparent",
          "text-sm dark:text-zinc-100 text-zinc-900",
          "resize-none flex-1 overflow-y-auto overflow-x-hidden",
          "focus:outline-none focus:ring-0 focus:border-zinc-200 dark:focus:border-zinc-800",
          "transition-all font-mono",
          "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
          "border-0",
          heightClasses,
          className
        )}
        style={{
          minHeight: defaultMinHeight,
          ...props.style,
        }}
        placeholder={placeholder}
        {...props}
      />
    )
  }
)

MarkdownTextarea.displayName = "MarkdownTextarea"

export { MarkdownTextarea }
