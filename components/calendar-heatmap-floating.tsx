"use client"
import { useState, useEffect } from "react"
import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { Calendar as CalendarIcon, EyeOff } from "lucide-react"

type Props = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

export function CalendarHeatmapFloating({ posts, notes }: Props) {
  const [showCalendar, setShowCalendar] = useState(false)  

  useEffect(() => {
    const stored = localStorage.getItem('showCalendar')
    if (stored !== null) {
      setShowCalendar(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('showCalendar', JSON.stringify(showCalendar))
  }, [showCalendar])

  return (
    <div className="fixed left-10 z-40 hidden md:block select-none" style={{ top: '115px' }}>
      <button
        className={`absolute left-2 -top-7 z-50 w-7 h-7 flex items-center justify-center rounded-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-200 ease-out hover:scale-110 active:scale-95 shadow-sm`}
        onClick={() => setShowCalendar(v => !v)}
        aria-label={showCalendar ? "隐藏日历" : "显示日历"}
      >
        {showCalendar ? <EyeOff className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
      </button>
      {showCalendar && (
        <div className="mt-3 rounded-xl bg-white/60 dark:bg-zinc-900/60 shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 backdrop-blur-md backdrop-saturate-150">
          <CalendarHeatmap posts={posts} notes={notes} />
        </div>
      )}
    </div>
  )
}