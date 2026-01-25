"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface MiniCalendarHeatmapProps {
  posts: { date: string }[]
  notes: { date: string }[]
}

export function MiniCalendarHeatmap({ posts, notes }: MiniCalendarHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  
  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  
  // 统计最近30天的创作数量
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
  
  // 生成最近30天的日期数组
  const dates = useMemo(() => {
    const today = new Date()
    const dates: Date[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date)
    }
    return dates
  }, [])
  
  // 获取最大数量，用于颜色分级
  const maxCount = useMemo(() => {
    return Math.max(...Object.values(countMap), 1)
  }, [countMap])
  
  // 获取颜色类（增强对比度）
  const getDotClass = (count: number) => {
    if (!count) return "bg-zinc-200 dark:bg-zinc-800"
    
    const intensity = count / maxCount
    if (intensity <= 0.25) return "bg-zinc-400 dark:bg-zinc-600"
    if (intensity <= 0.5) return "bg-zinc-600 dark:bg-zinc-400"
    if (intensity <= 0.75) return "bg-zinc-800 dark:bg-zinc-200"
    return "bg-zinc-950 dark:bg-zinc-50"
  }
  
  const todayKey = getDateKey(new Date())
  
  return (
    <div className="relative">
      {/* 热力图 - 简化设计，紧凑布局 */}
      <div 
        className="flex flex-wrap gap-0.5"
        onMouseLeave={() => setHoveredDate(null)}
      >
        {dates.map((date: Date, index: number) => {
          const key = getDateKey(date)
          const count = countMap[key] || 0
          const isToday = key === todayKey
          const isHovered = hoveredDate === key
          
          return (
            <div
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all cursor-pointer",
                getDotClass(count),
                isToday && "ring-1 ring-zinc-500 dark:ring-zinc-400 ring-offset-0.5",
                isHovered && "scale-125 z-10 shadow-md"
              )}
              onMouseEnter={() => setHoveredDate(key)}
              title={`${format(date, "yyyy年MM月dd日", { locale: zhCN })}: ${count} 篇`}
            />
          )
        })}
      </div>
      
      {/* 悬浮提示 */}
      {hoveredDate && (() => {
        const date = dates.find(d => getDateKey(d) === hoveredDate)
        if (!date) return null
        const count = countMap[hoveredDate] || 0
        return (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium whitespace-nowrap shadow-lg z-20 pointer-events-none">
            {format(date, "MM月dd日", { locale: zhCN })} · {count} 篇
          </div>
        )
      })()}
      
      {/* 颜色图例 */}
      <div className="flex items-center justify-center gap-2 mt-5">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">较少</span>
        <div className="flex items-center gap-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 dark:bg-zinc-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-zinc-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-50" />
        </div>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">较多</span>
      </div>
    </div>
  )
}
