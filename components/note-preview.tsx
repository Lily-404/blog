"use client"

import { format } from "date-fns"
import { useMemo } from "react"
import { MarkdownPreview } from "@/components/markdown-preview"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { NoteTimelineBlock, NOTE_AVATAR_CLASSES } from "@/components/ui/note-timeline-block"
import { PreviewPlaceholder } from "@/components/ui/preview-placeholder"

interface NotePreviewProps {
  content: string
  date: string
}

const emptyMessages = [
  "等待你的第一行文字，让想法在这里落地生根",
  "让思绪化作文字，在这片空白中自由生长",
  "每一个字都是种子，等待在纸上开出花来",
  "静待你的笔触，为这空白注入生命",
  "文字是时间的容器，等待被你的故事填满",
  "让灵感在这里栖息，让文字在这里起舞",
  "空白是最大的可能，等待你的第一笔",
  "让这一刻的想法，成为永恒的文字",
  "思绪如风，等待被文字捕捉",
  "在这片空白中，书写你的世界",
]

function stableIndex(seed: string, modulo: number) {
  // 简单可重复 hash（避免 Math.random 引发 hydration mismatch）
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return modulo === 0 ? 0 : hash % modulo
}

export function NotePreview({ content, date }: NotePreviewProps) {
  const emptyMessage = useMemo(() => {
    const seed = `${date}|${content}`
    return emptyMessages[stableIndex(seed, emptyMessages.length)]
  }, [content, date])

  if (!content.trim()) {
    return <PreviewPlaceholder message={emptyMessage} italic />
  }

  return (
    <NoteTimelineBlock
      avatar={
        <OptimizedImage
          src="/cat.jpg"
          alt="Jimmy's avatar"
          width={40}
          height={40}
          className={NOTE_AVATAR_CLASSES}
          sizes="40px"
          quality={85}
        />
      }
      meta={
        <>
          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Jimmy</div>
          {!!date && (
            <time className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
              {format(new Date(date), "yyyy/MM/dd")}
            </time>
          )}
        </>
      }
      contentClassName="note-preview-content"
    >
      <MarkdownPreview content={content} />
    </NoteTimelineBlock>
  )
}

