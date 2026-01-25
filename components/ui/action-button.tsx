"use client"

import { type ReactNode, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

const BASE_STYLES = [
  "flex items-center px-4 py-2 rounded-lg",
  "bg-zinc-100/50 dark:bg-zinc-800/50",
  "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50",
  "border border-zinc-200/50 dark:border-zinc-700/50",
  "hover:border-zinc-300/50 dark:hover:border-zinc-600/50",
  "text-zinc-600 dark:text-zinc-400",
  "hover:text-zinc-800 dark:hover:text-zinc-200",
  "transition-colors",
] as const

const ICON_STYLES = "h-5 w-5 mr-2 shrink-0"

export interface ActionButtonProps {
  /** 图标（与 leading 二选一） */
  icon?: LucideIcon
  /** 自定义前导内容，如自定义字符/图标（覆盖 icon） */
  leading?: ReactNode
  /** 链接地址，提供则渲染为 <a> */
  href?: string
  /** 点击事件，用于 button 模式 */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
  /** 图标类名 */
  iconClassName?: string
  children: ReactNode
  /** <a> 专用：target、rel 等 */
  target?: string
  rel?: string
  /** button 专用：是否禁用 */
  disabled?: boolean
}

export const ActionButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, ActionButtonProps>(
  (
    {
      icon: Icon,
      leading,
      href,
      onClick,
      className,
      iconClassName,
      children,
      target,
      rel,
      ...rest
    },
    ref
  ) => {
    const content = (
      <>
        {leading != null ? (
          <span className={cn(ICON_STYLES, "flex items-center justify-center", iconClassName)}>
            {leading}
          </span>
        ) : Icon != null ? (
          <Icon className={cn(ICON_STYLES, iconClassName)} />
        ) : null}
        <span>{children}</span>
      </>
    )

    const classes = cn(BASE_STYLES, className)

    if (href != null) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={classes}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={classes}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    )
  }
)

ActionButton.displayName = "ActionButton"
