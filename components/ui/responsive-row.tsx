"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResponsiveRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 间距大小，默认 md */
  gap?: "sm" | "md" | "lg"
  /** 是否在移动端垂直排列，默认 true */
  verticalOnMobile?: boolean
}

const gapStyles = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
} as const

const ResponsiveRow = React.forwardRef<HTMLDivElement, ResponsiveRowProps>(
  (
    {
      gap = "md",
      verticalOnMobile = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          verticalOnMobile ? "flex-col lg:flex-row" : "flex-row",
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveRow.displayName = "ResponsiveRow"

export { ResponsiveRow }
