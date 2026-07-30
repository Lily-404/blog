"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { getDateKey, buildCountMap, getDotClassFixed } from "@/lib/calendar-heatmap-utils"
import { MonthNavigation } from "@/components/ui/month-navigation"

type CalendarHeatmapProps = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

export function CalendarHeatmap({ posts, notes = [] }: CalendarHeatmapProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (!isCurrentMonth) {
      if (month === 11) {
        setYear((y) => y + 1)
        setMonth(0)
      } else {
        setMonth((m) => m + 1)
      }
    }
  }

  const countMap = useMemo(() => buildCountMap(posts, notes), [posts, notes])

  const tagSet = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((post) => {
      if ("tags" in post && post.tags)
        (post.tags as string[]).forEach((tag: string) => set.add(tag))
    })
    return set
  }, [posts])

  let firstDay = new Date(year, month, 1).getDay()
  firstDay = firstDay === 0 ? 7 : firstDay
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const gridArray = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - (firstDay - 1) + 1
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return new Date(year, month, dayNum)
    }
    return null
  })

  const todayKey = getDateKey(today)
  const hoveredDate = hoveredKey
    ? gridArray.find((d) => d && getDateKey(d) === hoveredKey) ?? null
    : null

  const stats = [
    { label: "文章", value: posts.length },
    { label: "标签", value: tagSet.size },
    { label: "随笔", value: notes.length },
  ]

  return (
    <div className="flex flex-col items-center">
      <MonthNavigation
        year={year}
        month={month}
        disableNext={isCurrentMonth}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      <div className="grid grid-cols-7 gap-1 mb-1.5 w-fit">
        {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
          <span
            key={d}
            className="font-mono text-[10px] tracking-wider text-zinc-400 dark:text-zinc-500 block text-center w-4"
          >
            {d}
          </span>
        ))}
      </div>

      <div
        className="relative grid gap-1 w-fit"
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gridTemplateRows: "repeat(6, minmax(0, 1fr))",
        }}
        onMouseLeave={() => setHoveredKey(null)}
      >
        {gridArray.map((date, i) =>
          date ? (
            <div
              key={getDateKey(date)}
              onMouseEnter={() => setHoveredKey(getDateKey(date))}
              className={cn(
                "w-4 h-4 rounded-full cursor-default transition-opacity duration-150",
                getDotClassFixed(countMap[getDateKey(date)] ?? 0),
                getDateKey(date) === todayKey &&
                  isCurrentMonth &&
                  "outline outline-1 outline-zinc-500 dark:outline-zinc-400 outline-offset-1"
              )}
            />
          ) : (
            <div key={`empty-${i}`} className="w-4 h-4 bg-transparent" />
          )
        )}

        {hoveredDate && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap px-2 py-1 rounded font-mono text-[10px] tracking-wide bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            {hoveredDate.getMonth() + 1}.{String(hoveredDate.getDate()).padStart(2, "0")}
            {" · "}
            {countMap[getDateKey(hoveredDate)] || 0}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
          少
        </span>
        <div className="flex items-center gap-[3px]">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900/30 dark:bg-zinc-100/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900/55 dark:bg-zinc-100/55" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
        </div>
        <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
          多
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 w-full flex justify-center gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-1.5">
            <span className="font-mono text-[14px] tabular-nums text-zinc-900 dark:text-zinc-100">
              {stat.value}
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
