"use client"

import { MiniCalendarHeatmap } from "./mini-calendar-heatmap"
import { cn } from "@/lib/utils"

import { DatePicker } from "@/components/ui/date-picker"
import { TagInput } from "@/components/ui/tag-input"

interface StatsSectionProps {
  stats: {
    posts: { date: string }[]
    notes: { date: string }[]
    tags: { tag: string; count: number }[]
    stats: {
      totalPosts: number
      totalNotes: number
      thisMonthPosts: number
      thisMonthNotes: number
      thisWeekPosts: number
      thisWeekNotes: number
    }
  }
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  // 表单字段
  title: string
  date: string
  onTitleChange: (title: string) => void
  onDateChange: (date: string) => void
  onTagsChange: (tags: string[]) => void
}

export function StatsSection({ 
  stats, 
  selectedTags, 
  onTagToggle,
  title,
  date,
  onTitleChange,
  onDateChange,
  onTagsChange
}: StatsSectionProps) {
  return (
    <>
      {/* 创作统计区域 */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧卡片 - 标题和日期 */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {/* 标题输入 - 支持多行 */}
          <div className="relative bg-stone-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="relative">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">文章标题</div>
              <textarea
                id="title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full min-h-[2rem] pl-0 pr-2 py-1 text-sm bg-transparent dark:text-zinc-100 text-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold resize-none overflow-hidden"
                placeholder="输入标题"
                required
                title=""
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${Math.min(target.scrollHeight, 80)}px`
                }}
              />
            </div>
          </div>
          
          {/* 日期选择 - 优化设计 */}
          <div className="relative bg-stone-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="relative">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-medium">发布日期</div>
              <DatePicker
                value={date}
                onChange={onDateChange}
                placeholder="选择日期"
                className="h-auto text-sm w-full"
              />
            </div>
          </div>
        </div>
        
        {/* 中间 - 迷你日历热力图 */}
        <div className="lg:col-span-4 relative bg-stone-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="relative">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">最近30天</div>
            <MiniCalendarHeatmap posts={stats.posts} notes={stats.notes} />
          </div>
        </div>
        
        {/* 右侧卡片 - 统计信息 */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {/* 本月创作 */}
          <div className="relative bg-stone-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="relative">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">本月创作</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {stats.stats.thisMonthPosts + stats.stats.thisMonthNotes}
              </div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500">
                {stats.stats.thisMonthPosts} 文章 · {stats.stats.thisMonthNotes} 随笔
              </div>
            </div>
          </div>
          
          {/* 总文章数 */}
          <div className="relative bg-stone-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="relative">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">总文章数</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {stats.stats.totalPosts}
              </div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500">
                总随笔数 {stats.stats.totalNotes}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签区域 - 整合表单标签 */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">标签：</div>
          {/* 标签输入 */}
          <div className="flex-1">
            <TagInput
              value={selectedTags}
              onChange={onTagsChange}
              placeholder="输入标签后按回车添加"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          
          {/* 常用标签 */}
          {stats.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 self-center">常用：</span>
              {stats.tags.slice(0, 10).map(({ tag, count }) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagToggle(tag)}
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs transition-colors",
                      isSelected
                        ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    {tag}
                    <span className={cn(
                      "ml-1",
                      isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
