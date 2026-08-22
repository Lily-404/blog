"use client"

import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { Calendar as CalendarIcon, EyeOff } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Props = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

export function CalendarHeatmapFloating({ posts, notes }: Props) {
  const [showCalendar, setShowCalendar] = useLocalStorage("showCalendar", false)

  return (
    <div className="fixed left-10 z-40 hidden md:block select-none" style={{ top: "115px" }}>
      <IconButton
        icon={showCalendar ? EyeOff : CalendarIcon}
        size="sm"
        variant="light"
        onClick={() => setShowCalendar((v) => !v)}
        className="absolute left-2 -top-7 z-50 shadow-sm"
        aria-label={showCalendar ? "隐藏日历" : "显示日历"}
      />

      {showCalendar && (
        <div className="mt-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CalendarHeatmap posts={posts} notes={notes} />
        </div>
      )}
    </div>
  )
}
