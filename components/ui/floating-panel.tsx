import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * 浮层面板基础样式常量
 * 用于统一所有浮层（Tooltip、Popover、自定义浮层）的样式
 */
export const FLOATING_PANEL_BASE_STYLES = [
  "rounded-xl",
  "border border-zinc-200 dark:border-zinc-700",
  "shadow-sm",
  "bg-white/80 dark:bg-zinc-900/80",
  "backdrop-blur-md backdrop-saturate-150",
] as const

/**
 * 浮层面板变体样式
 */
export const FLOATING_PANEL_VARIANTS = {
  default: [
    "bg-white/80 dark:bg-zinc-900/80",
    "border-zinc-200 dark:border-zinc-700",
  ],
  light: [
    "bg-white/60 dark:bg-zinc-900/60",
    "border-zinc-200 dark:border-zinc-700",
  ],
  solid: [
    "bg-white dark:bg-zinc-900",
    "border-zinc-200 dark:border-zinc-800",
  ],
} as const

export interface FloatingPanelProps {
  children: ReactNode
  /** 变体 */
  variant?: keyof typeof FLOATING_PANEL_VARIANTS
  /** 自定义类名 */
  className?: string
  /** 内边距 */
  padding?: "sm" | "md" | "lg" | "none"
}

const paddingStyles = {
  sm: "px-2 py-1",
  md: "px-4 py-2",
  lg: "p-4",
  none: "",
} as const

/**
 * 浮层面板组件
 * 用于统一浮层样式，可作为 Tooltip、Popover 等的基础
 */
export function FloatingPanel({
  children,
  variant = "default",
  className,
  padding = "md",
}: FloatingPanelProps) {
  return (
    <div
      className={cn(
        FLOATING_PANEL_BASE_STYLES,
        FLOATING_PANEL_VARIANTS[variant],
        padding !== "none" && paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
