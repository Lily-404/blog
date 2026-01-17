"use client"

import { format } from "date-fns"
import { MarkdownPreview } from "./markdown-preview"

interface NotePreviewProps {
  content: string
  date: string
}

export function NotePreview({ content, date }: NotePreviewProps) {
  if (!content.trim()) {
    return (
      <div className="text-center text-zinc-400 dark:text-zinc-600 py-12">
        输入内容后，预览将显示在这里
      </div>
    )
  }

  return (
    <div className="group relative pb-6">
      {/* 头像区域 */}
      <div className="relative flex items-stretch gap-3">
        <div className="relative">
          <img
            src="/cat.jpg"
            alt="Jimmy's avatar"
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
