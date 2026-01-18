"use client"

import { DatePicker } from "@/components/ui/date-picker"
import { TagInput } from "@/components/ui/tag-input"

interface PostFormProps {
  title: string
  date: string
  tags: string[]
  onTitleChange: (title: string) => void
  onDateChange: (date: string) => void
  onTagsChange: (tags: string[]) => void
}

export function PostForm({
  title,
  date,
  tags,
  onTitleChange,
  onDateChange,
  onTagsChange,
}: PostFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900/50 rounded-xl p-4 relative">
      {/* 精致的顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent"></div>
      
      {/* 基础信息表单 - 极简设计，无边框 */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full h-8 px-2 text-sm bg-transparent dark:text-zinc-100 text-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder="文章标题"
            required
          />
        </div>

        <div className="flex-1 min-w-0">
          <DatePicker
            value={date}
            onChange={onDateChange}
            placeholder="选择日期"
            className="h-8 text-sm w-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <TagInput
            value={tags}
            onChange={onTagsChange}
            placeholder="标签（可选）"
          />
        </div>
      </div>
    </div>
  )
}
