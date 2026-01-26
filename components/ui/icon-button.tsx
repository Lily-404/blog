"use client"

import { type ReactNode, forwardRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

// 按钮尺寸配置
const sizeConfig = {
  sm: {
    container: "w-7 h-7",
    icon: "w-4 h-4",
  },
  md: {
    container: "w-10 h-10",
    icon: "w-5 h-5",
  },
  lg: {
    container: "w-12 h-12",
    icon: "w-6 h-6",
  },
} as const

// 基础样式类
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
] as const

// 激活状态样式
const ACTIVE_STYLES = [
  "!bg-zinc-900 !text-white !hover:bg-zinc-800",
  "dark:!bg-zinc-50 dark:!text-zinc-900 dark:!hover:bg-zinc-200",
  "!shadow-sm",
] as const

// 禁用状态样式
const DISABLED_STYLES = [
  "disabled:bg-zinc-200 disabled:dark:bg-zinc-800",
  "disabled:border-zinc-300 disabled:dark:border-zinc-700",
  "disabled:text-zinc-400 disabled:dark:text-zinc-500",
  "disabled:shadow-none",
  "disabled:hover:bg-zinc-200 disabled:dark:hover:bg-zinc-800",
  "disabled:hover:text-zinc-400 disabled:dark:hover:text-zinc-500",
  "disabled:cursor-not-allowed",
  "disabled:hover:scale-100",
] as const

export type IconButtonSize = keyof typeof sizeConfig

export interface IconButtonProps {
  /** 图标组件 */
  icon: LucideIcon
  /** 按钮尺寸 */
  size?: IconButtonSize
  /** 是否激活状态 */
  active?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 图标自定义类名 */
  iconClassName?: string
  /** 点击事件（用于 button 模式） */
  onClick?: () => void
  /** 链接地址（用于 Link 模式） */
  href?: string
  /** aria-label */
  "aria-label"?: string
  /** 自定义背景色（覆盖默认） */
  variant?: "default" | "light" | "transparent"
  /** 子元素（可选，用于更复杂的场景） */
  children?: ReactNode
}

// 背景变体样式
const variantStyles = {
  default: "bg-zinc-100/50 dark:bg-zinc-700/50",
  light: "bg-zinc-50/50 dark:bg-zinc-800/50 backdrop-blur-sm",
  transparent: "bg-transparent",
} as const

/**
 * 可复用的图标按钮组件
 * 支持作为 button 或 Link 使用
 */
export const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>(({
  icon: Icon,
  size = "md",
  active = false,
  disabled = false,
  className,
  iconClassName,
  onClick,
  href,
  "aria-label": ariaLabel,
  variant = "default",
  children,
}, ref) => {
  const sizeStyles = sizeConfig[size]
  const baseBgStyle = variantStyles[variant]

  const buttonClasses = cn(
    BASE_STYLES,
    sizeStyles.container,
    baseBgStyle,
    variant === "light" && "!backdrop-blur-sm !backdrop-saturate-100",
    active && ACTIVE_STYLES,
    disabled && DISABLED_STYLES,
    className
  )

  const iconClasses = cn(sizeStyles.icon, iconClassName)

  // 如果提供了 href，渲染为 Link
  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        aria-label={ariaLabel}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children || <Icon className={iconClasses} />}
      </Link>
    )
  }

  // 否则渲染为 button
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
      ref={ref as React.Ref<HTMLButtonElement>}
    >
      {children || <Icon className={iconClasses} />}
    </button>
  )
})

IconButton.displayName = "IconButton"
