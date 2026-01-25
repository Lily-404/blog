import { cn } from "@/lib/utils"

export interface PreviewPlaceholderProps {
  message: string
  italic?: boolean
  className?: string
}

const BASE_CLASSES =
  "text-center text-zinc-400 dark:text-zinc-600 py-12" as const

export function PreviewPlaceholder({
  message,
  italic = false,
  className,
}: PreviewPlaceholderProps) {
  return (
    <div className={cn(BASE_CLASSES, italic && "italic", className)}>
      {message}
    </div>
  )
}
