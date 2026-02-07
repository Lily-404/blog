"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PreviewPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否在 split 模式下使用（影响高度样式） */
  splitMode?: boolean
  /** 预览区域背景变体 */
  variant?: "default" | "muted"
}

const PreviewPane = React.forwardRef<HTMLDivElement, PreviewPaneProps>(
  (
    {
      splitMode = false,
      variant = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const heightClasses = splitMode
      ? "h-[300px] lg:h-[600px] min-h-[300px] lg:min-h-[600px] max-h-[300px] lg:max-h-[600px]"
      : ""

    const bgClasses =
      variant === "muted"
        ? "bg-zinc-50/80 dark:bg-zinc-800/30 backdrop-blur-sm"
        : "bg-transparent"

    const splitBorderClasses = splitMode
      ? "border-t border-zinc-300 dark:border-zinc-600 lg:border-t-0 lg:border-l lg:box-border"
      : ""

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 flex flex-col min-w-0",
          "px-5 py-4 overflow-y-auto overflow-x-hidden",
          bgClasses,
          heightClasses,
          splitBorderClasses,
          className
        )}
        style={{
          minHeight: splitMode ? undefined : "600px",
          ...props.style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PreviewPane.displayName = "PreviewPane"

export { PreviewPane }
