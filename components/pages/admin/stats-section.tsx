"use client"

import { MiniCalendarHeatmap } from "./mini-calendar-heatmap"
import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { SelectableTag } from "@/components/ui/selectable-tag"
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
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-full overflow-x-hidden">
        {/* 左侧卡片 - 标题和日期 */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {/* 标题输入 - 支持多行 */}
          <Card size="md" hover>
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
          </Card>
          
          {/* 日期选择 - 优化设计 */}
          <Card size="md" hover>
            <div className="relative">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-medium">发布日期</div>
              <DatePicker
                value={date}
                onChange={onDateChange}
                placeholder="选择日期"
                className="h-auto text-sm w-full"
              />
            </div>
          </Card>
        </div>
        
        {/* 中间 - 迷你日历热力图 */}
        <Card className="lg:col-span-4" size="md" rounded="xl" hover>
          <div className="relative">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">最近30天</div>
            <MiniCalendarHeatmap posts={stats.posts} notes={stats.notes} />
          </div>
        </Card>
        
        {/* 右侧卡片 - 统计信息 */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {/* 本月创作 */}
          <StatCard
            label="本月创作"
            value={stats.stats.thisMonthPosts + stats.stats.thisMonthNotes}
            subtitle={`${stats.stats.thisMonthPosts} 文章 · ${stats.stats.thisMonthNotes} 随笔`}
            valueSize="lg"
          />
          
          {/* 总文章数 */}
          <StatCard
            label="总文章数"
            value={stats.stats.totalPosts}
            subtitle={`总随笔数 ${stats.stats.totalNotes}`}
            valueSize="lg"
          />
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
              {stats.tags.slice(0, 10).map(({ tag, count }) => (
                <SelectableTag
                  key={tag}
                  tag={tag}
                  count={count}
                  selected={selectedTags.includes(tag)}
                  onToggle={onTagToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
