"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"
import { ActionButton } from "./action-button"

export interface CopyButtonProps {
  /** 要复制的文本 */
  value: string
  /** 图标 */
  icon?: LucideIcon
  /** 自定义前导内容（覆盖 icon） */
  leading?: ReactNode
  /** 按钮文本 */
  children: ReactNode
  /** 复制成功回调 */
  onSuccess?: () => void
  /** 复制失败回调 */
  onError?: (error: Error) => void
  /** 自定义类名 */
  className?: string
  /** 提示文本（默认："已复制到剪贴板"） */
  successMessage?: string
  /** 提示显示时长（毫秒，默认：2000） */
  duration?: number
}

/**
 * 复制按钮组件
 * 点击后复制文本到剪贴板，并显示成功提示
 */
export function CopyButton({
  value,
  icon,
  leading,
  children,
  onSuccess,
  onError,
  className,
  successMessage = "已复制到剪贴板",
  duration = 2000,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onSuccess?.()
      setTimeout(() => setCopied(false), duration)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("复制失败")
      console.error("Failed to copy:", error)
      onError?.(error)
    }
  }

  return (
    <div className="relative group">
      <ActionButton
        icon={icon}
        leading={leading}
        onClick={handleCopy}
        className={className}
      >
        {children}
      </ActionButton>
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-md whitespace-nowrap z-50">
          {successMessage}
        </div>
      )}
    </div>
  )
}
