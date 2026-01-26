"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// 复用 IconButton 的基础样式常量
const BASE_STYLES = [
  "flex items-center justify-center rounded-full",
  "bg-zinc-100/50 dark:bg-zinc-700/50",
  "backdrop-blur-md backdrop-saturate-150",
  "border border-zinc-200/50 dark:border-zinc-600/50",
  "hover:border-zinc-300/50 dark:hover:border-zinc-500/50",
  "shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)]",
  "hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)]",
  "text-zinc-600 dark:text-zinc-300",
  "hover:text-zinc-800 dark:hover:text-zinc-100",
  "transition-all duration-200 ease-out",
  "hover:scale-110 active:scale-95",
  "text-xs font-medium",
] as const

// 激活状态样式（与 IconButton 一致）
const ACTIVE_STYLES = [
  "!bg-zinc-900 !text-white !hover:bg-zinc-800",
  "dark:!bg-zinc-50 dark:!text-zinc-900 dark:!hover:bg-zinc-200",
  "!shadow-sm",
] as const

export interface PageNumberButtonProps {
  /** 页码数字 */
  pageNumber: number
  /** 是否激活（当前页） */
  active?: boolean
  /** 点击事件 */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
  /** 尺寸 */
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: "w-7 h-7 text-xs",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
} as const

/**
 * 页码按钮组件
 * 复用 IconButton 的样式体系，保持视觉一致性
 */
export const PageNumberButton = forwardRef<
  HTMLButtonElement,
  PageNumberButtonProps
>(({ pageNumber, active = false, onClick, className, size = "md" }, ref) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        BASE_STYLES,
        sizeConfig[size],
        active && ACTIVE_STYLES,
        className
      )}
      aria-label={`第 ${pageNumber} 页`}
      ref={ref}
    >
      {pageNumber}
    </button>
  )
})

PageNumberButton.displayName = "PageNumberButton"
