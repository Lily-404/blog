import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertProps {
  children: React.ReactNode
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
  className?: string
}

export function Alert({
  children,
  variant = "default",
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  className,
}: AlertProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose])

  const variantStyles = {
    default: "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200",
    destructive: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
  }

  return (
    <div
      className={cn(
        "relative p-4 border rounded-md",
        variantStyles[variant],
        className
      )}
    >
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
