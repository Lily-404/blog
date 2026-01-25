"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const sizeConfig = {
  sm: {
    icon: "w-4 h-4",
    container: "p-3",
  },
  md: {
    icon: "w-6 h-6",
    container: "p-4",
  },
  lg: {
    icon: "w-8 h-8",
    container: "p-6",
  },
} as const

export type LoadingSpinnerSize = keyof typeof sizeConfig

export interface LoadingSpinnerProps {
  /** 主消息 */
  message?: string
  /** 副消息（可选） */
  subMessage?: string
  /** 尺寸 */
  size?: LoadingSpinnerSize
  /** 是否全页布局（添加 min-h-[60vh]） */
  fullPage?: boolean
  /** 自定义类名 */
  className?: string
}

export function LoadingSpinner({
  message = "加载中...",
  subMessage,
  size = "md",
  fullPage = false,
  className,
}: LoadingSpinnerProps) {
  const sizeStyles = sizeConfig[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullPage && "min-h-[60vh]",
        !fullPage && "py-16",
        className
      )}
    >
      <div className="relative">
        {/* 模糊圆环背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 rounded-full blur-xl opacity-50 animate-pulse" />
        {/* 旋转图标容器 */}
        <div className={cn(
          "relative bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800",
          sizeStyles.container
        )}>
          <Loader2 className={cn(
            "animate-spin text-zinc-600 dark:text-zinc-400",
            sizeStyles.icon
          )} />
        </div>
      </div>
      {/* 主消息 */}
      {message && (
        <p className={cn(
          "mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400",
          fullPage && "mt-6"
        )}>
          {message}
        </p>
      )}
      {/* 副消息 */}
      {subMessage && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500 italic">
          {subMessage}
        </p>
      )}
    </div>
  )
}

/**
 * 全页加载器，包装 LoadingSpinner 并固定布局
 */
export function PageLoader(props: Omit<LoadingSpinnerProps, "fullPage">) {
  return <LoadingSpinner {...props} fullPage={true} />
}
