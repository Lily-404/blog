"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface EditorWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 垂直内边距，默认 py-4 */
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingStyles = {
  none: "",
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
} as const

const EditorWrapper = React.forwardRef<HTMLDivElement, EditorWrapperProps>(
  ({ padding = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

EditorWrapper.displayName = "EditorWrapper"

export { EditorWrapper }
