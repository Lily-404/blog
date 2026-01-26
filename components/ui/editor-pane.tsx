"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface EditorPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否在 split 模式下使用（影响高度样式） */
  splitMode?: boolean
}

const EditorPane = React.forwardRef<HTMLDivElement, EditorPaneProps>(
  ({ splitMode = false, className, children, ...props }, ref) => {
    const heightClasses = splitMode
      ? "h-[300px] lg:h-[600px] min-h-[300px] lg:min-h-[600px] max-h-[300px] lg:max-h-[600px]"
      : ""

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 flex flex-col min-w-0",
          heightClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

EditorPane.displayName = "EditorPane"

export { EditorPane }
