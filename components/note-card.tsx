import { format } from "date-fns"
import type { NoteMeta as Note } from "@/app/lib/content"

export function NoteCard({ note, isLast }: { note: Note; isLast?: boolean }) {
  return (
    <div className="group relative pb-6">
      {/* 左侧时间线 */}
      {!isLast && (
        <div className="absolute left-5 top-0 w-0.5 bottom-[-12px] bg-zinc-200 dark:bg-zinc-700" />
      )}
      
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
              {format(new Date(note.date), "yyyy/MM/dd")}
            </time>
          </div>
          
          <div className="mt-1 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200
            whitespace-pre-wrap break-words">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  )
}