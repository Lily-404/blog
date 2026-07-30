"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { getDateKey, buildCountMap } from "@/lib/calendar-heatmap-utils"

interface MiniCalendarHeatmapProps {
  posts: { date: string }[]
  notes: { date: string }[]
}

function heatClass(count: number, maxCount: number): string {
  if (!count) return "nd-heat-empty"
  const intensity = count / maxCount
  if (intensity <= 0.25) return "nd-heat-1"
  if (intensity <= 0.5) return "nd-heat-2"
  if (intensity <= 0.75) return "nd-heat-3"
  return "nd-heat-4"
}

export function MiniCalendarHeatmap({ posts, notes }: MiniCalendarHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const countMap = useMemo(() => buildCountMap(posts, notes), [posts, notes])

  const dates = useMemo(() => {
    const today = new Date()
    const out: Date[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      out.push(d)
    }
    return out
  }, [])

  const maxCount = useMemo(
    () => Math.max(...Object.values(countMap), 1),
    [countMap]
  )

  const todayKey = getDateKey(new Date())

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-[3px]"
        onMouseLeave={() => setHoveredDate(null)}
      >
        {dates.map((date: Date, index: number) => {
          const key = getDateKey(date)
          const count = countMap[key] || 0
          const isToday = key === todayKey

          return (
            <div
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-opacity cursor-pointer",
                heatClass(count, maxCount),
                isToday && "outline outline-1 outline-[var(--nd-text-secondary)] outline-offset-1"
              )}
              onMouseEnter={() => setHoveredDate(key)}
              title={`${format(date, "yyyy年MM月dd日", { locale: zhCN })}: ${count} 篇`}
            />
          )
        })}
      </div>

      {hoveredDate && (() => {
        const date = dates.find((d) => getDateKey(d) === hoveredDate)
        if (!date) return null
        const count = countMap[hoveredDate] || 0
        return (
          <div className="absolute -top-8 left-0 z-20 pointer-events-none whitespace-nowrap px-2 py-1 rounded nd-mono text-[10px] tracking-wide text-[var(--nd-text-display)] bg-[var(--nd-text-display)] !text-[var(--nd-black)]">
            {format(date, "MM.dd", { locale: zhCN })} · {count}
          </div>
        )
      })()}

      <div className="flex items-center gap-2 mt-3">
        <span className="nd-caption">较少</span>
        <div className="flex items-center gap-[3px]">
          <div className="w-2.5 h-2.5 rounded-full nd-heat-empty" />
          <div className="w-2.5 h-2.5 rounded-full nd-heat-1" />
          <div className="w-2.5 h-2.5 rounded-full nd-heat-2" />
          <div className="w-2.5 h-2.5 rounded-full nd-heat-3" />
          <div className="w-2.5 h-2.5 rounded-full nd-heat-4" />
        </div>
        <span className="nd-caption">较多</span>
      </div>
    </div>
  )
}
