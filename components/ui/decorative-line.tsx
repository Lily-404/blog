import { cn } from "@/lib/utils"

export interface DecorativeLineProps {
  /** 自定义类名 */
  className?: string
  /** 位置，默认 'top' */
  position?: "top" | "bottom"
}

/**
 * 装饰线组件
 * 用于 Card 等容器的顶部或底部装饰
 */
export function DecorativeLine({
  className,
  position = "top",
}: DecorativeLineProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
    />
  )
}
