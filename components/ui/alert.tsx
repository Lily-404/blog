import * as React from "react"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
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

  const variantConfig = {
    default: {
      container: "bg-gradient-to-r from-blue-50/90 to-blue-50/70 dark:from-blue-950/40 dark:to-blue-950/20 border-blue-200/80 dark:border-blue-800/60 text-blue-900 dark:text-blue-100",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100/50 dark:bg-blue-900/30",
      iconComponent: Info,
    },
    destructive: {
      container: "bg-gradient-to-r from-red-50/90 to-red-50/70 dark:from-red-950/40 dark:to-red-950/20 border-red-200/80 dark:border-red-800/60 text-red-900 dark:text-red-100",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100/50 dark:bg-red-900/30",
      iconComponent: AlertCircle,
    },
    success: {
      container: "bg-gradient-to-r from-green-50/90 to-green-50/70 dark:from-green-950/40 dark:to-green-950/20 border-green-200/80 dark:border-green-800/60 text-green-900 dark:text-green-100",
      icon: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100/50 dark:bg-green-900/30",
      iconComponent: CheckCircle2,
    },
  }

  const config = variantConfig[variant]
  const IconComponent = config.iconComponent

  return (
    <div
      className={cn(
        "relative flex items-start gap-4 p-5 border rounded-xl shadow-lg backdrop-blur-md",
        "animate-in slide-in-from-top-3 fade-in-0 duration-300",
        "ring-1 ring-black/5 dark:ring-white/10",
        config.container,
        className
      )}
    >
      <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", config.iconBg)}>
        <IconComponent className={cn("w-5 h-5", config.icon)} />
      </div>
      <div className="flex-1 text-sm leading-relaxed font-medium">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all opacity-60 hover:opacity-100 shrink-0"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
