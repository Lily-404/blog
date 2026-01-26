"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MonthNavigationProps {
  /** 当前年份 */
  year: number
  /** 当前月份（0-11） */
  month: number
  /** 是否禁用"下个月"按钮（通常是当前月） */
  disableNext?: boolean
  /** 点击"上个月"的回调 */
  onPrev: () => void
  /** 点击"下个月"的回调 */
  onNext: () => void
  /** 自定义类名 */
  className?: string
  /** 日期格式化函数，默认格式：{year}年{month}月 */
  formatDate?: (year: number, month: number) => string
}

const pad2 = (n: number) => n.toString().padStart(2, "0")

const defaultFormatDate = (year: number, month: number) => {
  return `${year}年${pad2(month + 1)}月`
}

const buttonBaseStyles = [
  "w-7 h-7 flex items-center justify-center rounded-full",
  "bg-zinc-100/80 dark:bg-zinc-700/80",
  "border border-zinc-200/50 dark:border-zinc-600/50",
  "hover:border-zinc-300/50 dark:hover:border-zinc-500/50",
  "shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)]",
  "hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)]",
  "text-zinc-600 dark:text-zinc-300",
  "hover:text-zinc-800 dark:hover:text-zinc-100",
  "transition-all duration-200 ease-out",
  "hover:scale-110 active:scale-95",
] as const

const disabledStyles = [
  "opacity-50 cursor-not-allowed",
  "hover:scale-100",
] as const

export const MonthNavigation = React.forwardRef<
  HTMLDivElement,
  MonthNavigationProps
>(
  (
    {
      year,
      month,
      disableNext = false,
      onPrev,
      onNext,
      className,
      formatDate = defaultFormatDate,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center mb-2 gap-2", className)}
      >
        <button
          onClick={onPrev}
          className={cn(buttonBaseStyles)}
          aria-label="上个月"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-zinc-400 font-mono w-[6.5em] text-center">
          {formatDate(year, month)}
        </span>
        <button
          onClick={onNext}
          disabled={disableNext}
          className={cn(
            buttonBaseStyles,
            disableNext && disabledStyles
          )}
          aria-label="下个月"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }
)

MonthNavigation.displayName = "MonthNavigation"
