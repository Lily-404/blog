import * as React from "react"
import { cn } from "@/lib/utils"

const variantStyles = {
  default:
    "bg-stone-50/80 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800",
  elevated:
    "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-lg",
  muted:
    "bg-zinc-50/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-700/50",
} as const

const variantHoverBgStyles = {
  default: "hover:bg-stone-100 dark:hover:bg-zinc-900/70",
  elevated: "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
  muted: "hover:bg-zinc-50 dark:hover:bg-zinc-800/70",
} as const

const paddingStyles = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
} as const

const roundedStyles = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
} as const

export type CardVariant = keyof typeof variantStyles
export type CardSize = keyof typeof paddingStyles
export type CardRounded = keyof typeof roundedStyles

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  size?: CardSize
  /** 圆角覆盖，不传则随 size */
  rounded?: CardRounded
  /** 是否启用 hover 时阴影增强 */
  hover?: boolean
  /** 是否显示阴影，默认 true */
  shadow?: boolean
  /** 是否启用 hover 时背景色变化，默认 true */
  hoverBg?: boolean
}

const sizeToRounded: Record<CardSize, CardRounded> = {
  sm: "xl",
  md: "xl",
  lg: "2xl",
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      size = "md",
      rounded,
      hover = false,
      shadow = true,
      hoverBg = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const r = rounded ?? sizeToRounded[size]

    return (
      <div
        ref={ref}
        className={cn(
          "relative border transition-all",
          shadow && "shadow-sm",
          variantStyles[variant],
          hoverBg && variantHoverBgStyles[variant],
          paddingStyles[size],
          roundedStyles[r],
          hover && shadow && "hover:shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export { Card }
