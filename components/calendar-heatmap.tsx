"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { getDateKey, buildCountMap, getDotClassFixed } from "@/lib/calendar-heatmap-utils"
import { StatCard } from "@/components/ui/stat-card"
import { Card } from "@/components/ui/card"
import { FLOATING_PANEL_BASE_STYLES } from "@/components/ui/floating-panel"
import { MonthNavigation } from "@/components/ui/month-navigation"

type CalendarHeatmapProps = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

export function CalendarHeatmap({ posts, notes = [] }: CalendarHeatmapProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

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

  // 计算本月1号是星期几（以周一为一周的开始）
  let firstDay = new Date(year, month, 1).getDay(); // 0=周日
  firstDay = (firstDay === 0 ? 7 : firstDay); // 1=周一, 7=周日
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 生成42格（6周*7天）标准日历网格
  const gridArray = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - (firstDay - 1) + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return new Date(year, month, dayNum);
    }
    return null;
  });

  // 标记今天
  const todayKey = getDateKey(today)

  // 计算需要几行（始终6行）
  const rows = 6

  // 悬浮提示状态
  const [hovered, setHovered] = useState<{ x: number; y: number; date: Date | null } | null>(null)

  return (
    <div className="flex flex-col items-center rounded-2xl">
      <MonthNavigation
        year={year}
        month={month}
        disableNext={isCurrentMonth}
        onPrev={prevMonth}
        onNext={nextMonth}
      />
      {/* 周一到周日表头 */}
      <div className="grid grid-cols-7 gap-1 mb-1 w-fit" style={{ minWidth: 0 }}>
        {["一","二","三","四","五","六","日"].map(d => (
          <span key={d} className="text-[12px] text-zinc-400 font-mono block text-center w-4">{d}</span>
        ))}
      </div>
      <div
        className="grid gap-1 w-fit relative"
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {gridArray.map((date, i) =>
          date ? (
            <div
              key={getDateKey(date)}
              onMouseEnter={e => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setHovered({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  date
                })
              }}
              className={`w-4 h-4 rounded-full ${getDotClassFixed(countMap[getDateKey(date)] ?? 0)} ${getDateKey(date) === todayKey && isCurrentMonth ? "ring-2 ring-inset ring-black dark:ring-white" : ""}`}
            />
          ) : (
            <div key={`empty-${i}`} className="w-4 h-4 bg-transparent" />
          )
        )}
        {/* 自定义悬浮提示 */}
        {hovered && hovered.date && (
          <div
            className={cn(
              "pointer-events-none absolute z-50 px-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 whitespace-nowrap flex flex-col items-center",
              FLOATING_PANEL_BASE_STYLES
            )}
            style={{
              left: `calc(${((hovered.x - 24) / (7 * 24)) * 100}% + 20px)`,
              top: -56,
              minWidth: 100
            }}
          >
            <div className="font-mono text-xs font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
              {hovered.date ? `${hovered.date.getMonth() + 1}月${hovered.date.getDate()}日` : ''}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 text-xs">
              {countMap[getDateKey(hovered.date)] || 0} 篇内容
            </div>
          </div>
        )}
      </div>
      {/* 统计卡片 */}
      <Card variant="muted" size="md" hoverBg={false} rounded="xl" className="mt-4 w-full flex flex-col items-center">
        <div className="flex gap-6 justify-center">
          <StatCard
            value={posts.length}
            label="文章"
            layout="horizontal"
            valueSize="sm"
          />
          <StatCard
            value={tagSet.size}
            label="标签"
            layout="horizontal"
            valueSize="sm"
          />
          <StatCard
            value={notes.length}
            label="随笔"
            layout="horizontal"
            valueSize="sm"
          />
        </div>
      </Card>
    </div>
  )
} 