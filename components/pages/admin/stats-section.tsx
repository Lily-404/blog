"use client"

import { useState, KeyboardEvent, useRef } from "react"
import { MiniCalendarHeatmap } from "./mini-calendar-heatmap"
import { NdDatePicker } from "./nd-date-picker"
import { X } from "lucide-react"

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
  onTagsChange,
}: StatsSectionProps) {
  const [tagInput, setTagInput] = useState("")
  const [duplicate, setDuplicate] = useState(false)
  const tagRef = useRef<HTMLInputElement>(null)

  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag) {
      setTagInput("")
      return
    }
    if (selectedTags.includes(tag)) {
      setDuplicate(true)
      setTimeout(() => setDuplicate(false), 2000)
      setTagInput("")
      return
    }
    if (selectedTags.length >= 10) {
      setTagInput("")
      return
    }
    onTagsChange([...selectedTags, tag])
    setTagInput("")
    setDuplicate(false)
  }

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && tagInput === "" && selectedTags.length > 0) {
      onTagsChange(selectedTags.slice(0, -1))
    }
  }

  const monthTotal = stats.stats.thisMonthPosts + stats.stats.thisMonthNotes

  return (
    <div className="mb-6">
      {/* Dense 3-column instrument panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-4">
        {/* Title + Date */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <div className="nd-surface p-3">
            <label className="nd-label block mb-1.5" htmlFor="title">
              文章标题
            </label>
            <textarea
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none overflow-hidden text-[14px] font-medium leading-snug text-[var(--nd-text-display)] placeholder:text-[var(--nd-text-disabled)] min-h-[2rem]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              placeholder="输入标题"
              required
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "auto"
                target.style.height = `${Math.min(target.scrollHeight, 64)}px`
              }}
            />
          </div>
          <div className="nd-surface p-3">
            <label className="nd-label block mb-3">发布日期</label>
            <NdDatePicker
              value={date}
              onChange={onDateChange}
              placeholder="选择日期"
            />
          </div>
        </div>

        {/* Heatmap */}
        <div className="nd-surface lg:col-span-4 p-3">
          <p className="nd-label mb-2">最近 30 天</p>
          <MiniCalendarHeatmap posts={stats.posts} notes={stats.notes} />
        </div>

        {/* Compact stats */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <div className="nd-surface p-3">
            <p className="nd-label mb-1">本月创作</p>
            <div className="flex items-baseline gap-1.5">
              <span className="nd-display text-[32px] tabular-nums leading-none">
                {monthTotal}
              </span>
            </div>
            <p className="nd-caption mt-1.5">
              {stats.stats.thisMonthPosts} 文章 · {stats.stats.thisMonthNotes} 随笔
            </p>
          </div>
          <div className="nd-surface p-3">
            <p className="nd-label mb-1">总文章数</p>
            <div className="flex items-baseline gap-1.5">
              <span className="nd-display text-[32px] tabular-nums leading-none">
                {stats.stats.totalPosts}
              </span>
            </div>
            <p className="nd-caption mt-1.5">
              总随笔数 {stats.stats.totalNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="nd-label flex-shrink-0 pt-2.5">标签</span>
          <div className="flex-1 min-w-0">
            <div
              className="nd-tag-field"
              onClick={() => tagRef.current?.focus()}
            >
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="nd-chip"
                  data-active="true"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTagsChange(selectedTags.filter((t) => t !== tag))
                  }}
                  aria-label={`移除标签 ${tag}`}
                >
                  <span>{tag}</span>
                  <X className="w-3 h-3 opacity-70" strokeWidth={1.5} />
                </button>
              ))}
              {selectedTags.length < 10 && (
                <input
                  ref={tagRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value)
                    setDuplicate(false)
                  }}
                  onKeyDown={handleTagKey}
                  placeholder={selectedTags.length === 0 ? "输入标签后按回车添加" : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-[13px] text-[var(--nd-text-primary)] placeholder:text-[var(--nd-text-disabled)] font-[var(--font-space-grotesk)]"
                />
              )}
            </div>
            {duplicate && (
              <p className="nd-status mt-1.5" data-tone="error">
                [错误] 标签已存在
              </p>
            )}
            {selectedTags.length >= 10 && (
              <p className="nd-caption mt-1.5">最多 10 个标签</p>
            )}
          </div>
        </div>

        {stats.tags.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="nd-label flex-shrink-0 pt-1">常用</span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {stats.tags.slice(0, 10).map(({ tag, count }) => {
                const active = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    className="nd-chip"
                    data-active={active}
                    onClick={() => onTagToggle(tag)}
                    aria-pressed={active}
                  >
                    <span>{tag}</span>
                    <span className={active ? "opacity-60" : "text-[var(--nd-text-disabled)]"}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
