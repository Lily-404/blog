"use client"
import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { Calendar as CalendarIcon, EyeOff } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { Card } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Props = {
  posts: { date: string }[]
  notes?: { date: string }[]
}

export function CalendarHeatmapFloating({ posts, notes }: Props) {
  const [showCalendar, setShowCalendar] = useLocalStorage("showCalendar", false)

  return (
    <div className="fixed left-10 z-40 hidden md:block select-none" style={{ top: '115px' }}>
      <IconButton
        icon={showCalendar ? EyeOff : CalendarIcon}
        size="sm"
        variant="light"
        onClick={() => setShowCalendar(v => !v)}
        className="absolute left-2 -top-7 z-50 shadow-sm"
        aria-label={showCalendar ? "隐藏日历" : "显示日历"}
      />
      {showCalendar && (
        <Card variant="muted" size="md" hoverBg={false} rounded="2xl" className="mt-3">
          <CalendarHeatmap posts={posts} notes={notes} />
        </Card>
      )}
    </div>
  )
}