"use client"

import * as React from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import "react-day-picker/dist/style.css"

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showTodayButton?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "选择日期",
  className,
  disabled = false,
  showTodayButton = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const date = value ? new Date(value) : undefined

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      onChange(formattedDate)
      setOpen(false)
    }
  }

  const handleTodayClick = () => {
    const today = new Date()
    const formattedDate = format(today, "yyyy-MM-dd")
    onChange(formattedDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal border-0 rounded-none bg-transparent text-zinc-900 dark:text-zinc-100 hover:bg-transparent focus-visible:ring-0 p-0 h-auto",
            !date && "text-zinc-500 dark:text-zinc-400",
            !className?.includes("w-") && "w-full",
            className
          )}
          disabled={disabled}
        >
          {date ? (
            <div className="flex items-baseline gap-1.5 w-full">
              <div className="flex items-baseline gap-0.5 flex-1">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal tracking-wider uppercase">
                  {format(date, "yyyy", { locale: zhCN })}
                </span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none tracking-tighter">
                  {format(date, "MM", { locale: zhCN })}
                </span>
                <span className="text-sm text-zinc-400 dark:text-zinc-500 font-normal leading-none">月</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-none tracking-tighter">
                  {format(date, "dd", { locale: zhCN })}
                </span>
                <span className="text-sm text-zinc-400 dark:text-zinc-500 font-normal leading-none">日</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{placeholder}</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={zhCN}
          initialFocus
          defaultMonth={date || new Date()}
          className="p-4"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: "text-sm font-medium text-zinc-900 dark:text-zinc-100",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex mb-2",
            head_cell:
              "text-zinc-600 dark:text-zinc-400 rounded-lg w-9 font-normal text-xs",
            row: "flex w-full mt-1.5",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-outside)]:bg-transparent [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg cursor-pointer transition-colors"
            ),
            day_selected:
              "!bg-zinc-900 !dark:bg-zinc-100 !text-white !dark:text-zinc-900 hover:!bg-zinc-800 dark:hover:!bg-zinc-200 focus:!bg-zinc-900 dark:focus:!bg-zinc-100 font-medium rounded-lg",
            day_today: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-300 dark:border-zinc-600 rounded-lg",
            day_outside:
              "day-outside text-zinc-400 dark:text-zinc-600 opacity-50",
            day_disabled: "text-zinc-300 dark:text-zinc-700 opacity-50 cursor-not-allowed",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
        {showTodayButton && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleTodayClick}
              className="w-full text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              选择今天
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
