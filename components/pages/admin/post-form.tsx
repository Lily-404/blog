"use client"

import { Card } from "@/components/ui/card"
import { DecorativeLine } from "@/components/ui/decorative-line"
import { DatePicker } from "@/components/ui/date-picker"
import { TagInput } from "@/components/ui/tag-input"
import { ResponsiveRow } from "@/components/ui/responsive-row"
import { FormField } from "@/components/ui/form-field"

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
    <Card variant="default" size="md" className="relative">
      <DecorativeLine />
      
      {/* 基础信息表单 - 极简设计，无边框 */}
      <ResponsiveRow>
        <FormField>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full h-8 px-2 text-sm bg-transparent dark:text-zinc-100 text-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder="文章标题"
            required
          />
        </FormField>

        <FormField>
          <DatePicker
            value={date}
            onChange={onDateChange}
            placeholder="选择日期"
            className="h-8 text-sm w-full"
          />
        </FormField>

        <FormField>
          <TagInput
            value={tags}
            onChange={onTagsChange}
            placeholder="标签（可选）"
          />
        </FormField>
      </ResponsiveRow>
    </Card>
  )
}
