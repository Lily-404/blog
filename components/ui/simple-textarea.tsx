"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SimpleTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 文本大小，默认 lg */
  size?: "sm" | "md" | "lg"
  /** 是否自动聚焦 */
  autoFocus?: boolean
}

const sizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg leading-relaxed",
} as const

const SimpleTextarea = React.forwardRef<
  HTMLTextAreaElement,
  SimpleTextareaProps
>(
  (
    {
      size = "lg",
      autoFocus = false,
      className,
      placeholder = "记录这一刻的想法...",
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-0 py-0 border-none",
          sizeStyles[size],
          "dark:bg-transparent dark:text-zinc-100 bg-transparent text-zinc-900",
          "resize-none overflow-y-auto",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "focus-visible:outline-none focus-visible:ring-0",
          "transition-all",
          "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
          className
        )}
        style={{
          outline: "none",
          ...props.style,
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={(e) => {
          e.target.style.outline = "none"
          e.target.style.boxShadow = "none"
          e.target.style.border = "none"
          props.onFocus?.(e)
        }}
        {...props}
      />
    )
  }
)

SimpleTextarea.displayName = "SimpleTextarea"

export { SimpleTextarea }
