import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

export interface EmptyStateProps {
  /** 主消息 */
  message: string
  /** 副描述（可选） */
  description?: string
  /** 图标（可选） */
  icon?: LucideIcon
  /** 操作按钮（可选） */
  action?: ReactNode
  /** 自定义类名 */
  className?: string
  /** 垂直间距 */
  spacing?: "sm" | "md" | "lg"
}

const spacingStyles = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
} as const

/**
 * 空状态组件
 * 用于显示无数据时的提示信息
 */
export function EmptyState({
  message,
  description,
  icon: Icon,
  action,
  className,
  spacing = "md",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center",
        spacingStyles[spacing],
        className
      )}
    >
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
        </div>
      )}
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">
        {message}
      </p>
      {description && (
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4 flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}
