import { cn } from "@/lib/utils"

export const MARKDOWN_PROSE_CLASSES =
  "prose prose-zinc dark:prose-invert prose-sm max-w-none dark:text-zinc-200 break-words" as const

export interface MarkdownProseProps {
  html: string
  className?: string
}

export function MarkdownProse({ html, className }: MarkdownProseProps) {
  return (
    <div
      className={cn(MARKDOWN_PROSE_CLASSES, "w-full max-w-full overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
