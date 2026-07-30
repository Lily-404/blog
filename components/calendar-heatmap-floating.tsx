"use client"

import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { Calendar as CalendarIcon, EyeOff } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"

type Props = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

export function CalendarHeatmapFloating({ posts, notes }: Props) {
  const [showCalendar, setShowCalendar] = useLocalStorage("showCalendar", false)

  return (
    <div className="fixed left-10 z-40 hidden md:block select-none" style={{ top: "115px" }}>
      <button
        type="button"
        onClick={() => setShowCalendar((v) => !v)}
        className={cn(
          "absolute left-2 -top-7 z-50",
          "w-7 h-7 flex items-center justify-center rounded-full",
          "text-zinc-500 dark:text-zinc-400",
          "hover:text-zinc-900 dark:hover:text-zinc-100",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          "transition-colors duration-200"
        )}
        aria-label={showCalendar ? "隐藏日历" : "显示日历"}
      >
        {showCalendar ? (
          <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} />
        ) : (
          <CalendarIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
        )}
      </button>

      {showCalendar && (
        <div className="mt-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CalendarHeatmap posts={posts} notes={notes} />
        </div>
      )}
    </div>
  )
}
