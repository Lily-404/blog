"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CalendarHeatmapProps = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

function getDateKey(date: Date) {
  // 返回本地年月日字符串，格式：YYYY-MM-DD
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function CalendarHeatmap({ posts, notes = [] }: CalendarHeatmapProps) {
  // 当前显示的年月
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-based

  // 是否为本月
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  // 切换月份
  function prevMonth() {
    if (month === 0) {
      setYear(y => y - 1)
      setMonth(11)
    } else {
      setMonth(m => m - 1)
    }
  }
  function nextMonth() {
    if (!isCurrentMonth) {
      if (month === 11) {
        setYear(y => y + 1)
        setMonth(0)
      } else {
        setMonth(m => m + 1)
      }
    }
  }

  // 统计每天的数量（文章+随笔）
  const countMap = useMemo(() => {
    const map: Record<string, number> = {}
    posts.forEach(post => {
      const key = getDateKey(new Date(post.date))
      map[key] = (map[key] || 0) + 1
    })
    notes.forEach(note => {
      const key = getDateKey(new Date(note.date))
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [posts, notes])

  // 统计标签数量
  const tagSet = useMemo(() => {
    const set = new Set<string>()
    posts.forEach(post => {
      if ('tags' in post && post.tags) (post.tags as string[]).forEach((tag: string) => set.add(tag))
    })
    return set
  }, [posts])

  // 颜色分级（黑白点点）
  function getDotClass(count: number) {
    if (!count) return "bg-zinc-100 dark:bg-zinc-800"
    if (count === 1) return "bg-zinc-400 dark:bg-zinc-600"
    if (count === 2) return "bg-zinc-600 dark:bg-zinc-400"
    return "bg-black dark:bg-white"
  }

  // 格式化为两位数
  function pad2(n: number) {
    return n.toString().padStart(2, '0')
  }

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
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-2 gap-2">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-200 ease-out hover:scale-110 active:scale-95"
          aria-label="上个月"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-zinc-400 font-mono w-[6.5em] text-center">
          {year}年{pad2(month + 1)}月
        </span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className={`w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-200 ease-out ${!isCurrentMonth ? 'hover:scale-110 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
          aria-label="下个月"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
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
              className={`w-4 h-4 rounded-full ${getDotClass(countMap[getDateKey(date)] || 0)} ${getDateKey(date) === todayKey && isCurrentMonth ? 'ring-2 ring-inset ring-black dark:ring-white' : ''}`}
            />
          ) : (
            <div key={`empty-${i}`} className="w-4 h-4 bg-transparent" />
          )
        )}
        {/* 自定义悬浮提示 */}
        {hovered && hovered.date && (
          <div
            className="pointer-events-none absolute z-50 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md backdrop-saturate-150 text-xs text-zinc-800 dark:text-zinc-100 whitespace-nowrap flex flex-col items-center"
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
      <div className="mt-4 w-full rounded-xl bg-white/60 dark:bg-zinc-900/60 shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 backdrop-blur-md backdrop-saturate-150 flex flex-col items-center">
        <div className="flex gap-6 justify-center">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{posts.length}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">文章</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{tagSet.size}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">标签</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{notes.length}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">随笔</span>
          </div>
        </div>
      </div>
    </div>
  )
} 