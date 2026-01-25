import { type ReactNode } from "react"
import { Card } from "./card"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  /** 标签/标题（可选） */
  label?: string
  /** 主要数值（必需） */
  value: string | number
  /** 副标题/说明（可选） */
  subtitle?: string
  /** 布局方向 */
  layout?: "vertical" | "horizontal"
  /** 数值大小 */
  valueSize?: "sm" | "md" | "lg"
  /** 自定义类名 */
  className?: string
  /** 是否启用 hover 效果 */
  hover?: boolean
  /** horizontal 模式下是否使用 Card 包装 */
  wrapped?: boolean
}

const valueSizeStyles = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
} as const

/**
 * 统计卡片组件
 * 用于显示标签、数值和副标题的统计信息
 */
export function StatCard({
  label,
  value,
  subtitle,
  layout = "vertical",
  valueSize = "md",
  className,
  hover = false,
  wrapped = false,
}: StatCardProps) {
  const valueClass = cn(
    "font-bold text-zinc-900 dark:text-zinc-100",
    valueSizeStyles[valueSize],
    layout === "vertical" && "mb-1"
  )

  const content = (
    <div className={cn(
      "flex flex-col items-center",
      layout === "horizontal" && !wrapped && className
    )}>
      <span className={valueClass}>{value}</span>
      {label && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      )}
    </div>
  )

  if (layout === "horizontal") {
    if (wrapped) {
      return (
        <Card size="md" hover={hover} className={className} variant="muted" rounded="xl">
          {content}
        </Card>
      )
    }
    return content
  }

  return (
    <Card size="md" hover={hover} className={className}>
      <div className="relative">
        {label && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">
            {label}
          </div>
        )}
        <div className={valueClass}>{value}</div>
        {subtitle && (
          <div className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</div>
        )}
      </div>
    </Card>
  )
}
