"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SplitDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 分隔线颜色，默认使用主题色 */
  color?: "default" | "muted"
}

const SplitDivider = React.forwardRef<HTMLDivElement, SplitDividerProps>(
  ({ color = "default", className, ...props }, ref) => {
    const colorClasses =
      color === "muted"
        ? "bg-zinc-300 dark:bg-zinc-700"
        : "bg-zinc-200 dark:bg-zinc-800"

    return (
      <div
        ref={ref}
        className={cn(
          "h-px lg:h-full lg:w-px flex-shrink-0",
          colorClasses,
          className
        )}
        {...props}
      />
    )
  }
)

SplitDivider.displayName = "SplitDivider"

export { SplitDivider }
