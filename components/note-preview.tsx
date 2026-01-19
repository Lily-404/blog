"use client"

import { format } from "date-fns"
import { useMemo } from "react"
import { MarkdownPreview } from "./markdown-preview"
import { OptimizedImage } from "@/components/ui/optimized-image"

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

export function NotePreview({ content, date }: NotePreviewProps) {
  // 随机选择空内容的文案
  const emptyMessage = useMemo(() => {
    return emptyMessages[Math.floor(Math.random() * emptyMessages.length)]
  }, [])
  
  if (!content.trim()) {
    return (
      <div className="text-center text-zinc-400 dark:text-zinc-600 py-12 italic">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="group relative pb-6">
      {/* 头像区域 */}
      <div className="relative flex items-stretch gap-3">
        <div className="relative">
          <OptimizedImage
            src="/cat.jpg"
            alt="Jimmy's avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-[1px] border-zinc-100 dark:border-zinc-800 shadow-sm"
          />
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 -mt-1">
          <div className="flex items-baseline gap-2">
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Jimmy</div>
            <time className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tabular-nums">
              {date ? format(new Date(date), "yyyy/MM/dd") : format(new Date(), "yyyy/MM/dd")}
            </time>
          </div>
          
          <div className="mt-1 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 break-words note-preview-content">
            <MarkdownPreview content={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
