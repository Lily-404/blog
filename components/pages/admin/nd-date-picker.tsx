"use client"

import * as React from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import "react-day-picker/dist/style.css"

interface NdDatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showTodayButton?: boolean
  /** compact: 信息面板内；display: 随笔底栏等稍大展示 */
  size?: "compact" | "display"
}

export function NdDatePicker({
  value,
  onChange,
  placeholder = "选择日期",
  className,
  disabled = false,
  showTodayButton = true,
  size = "compact",
}: NdDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const date = value ? new Date(value) : undefined
  const isDisplay = size === "display"

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"))
      setOpen(false)
    }
  }

  const handleTodayClick = () => {
    onChange(format(new Date(), "yyyy-MM-dd"))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "w-full text-left bg-transparent border-0 p-0 h-auto cursor-pointer",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus-visible:outline-none",
            className
          )}
        >
          {date ? (
            <div className="flex items-baseline gap-1.5 w-full">
              <span className="nd-label !mb-0 flex-1 self-end pb-0.5">
                {format(date, "yyyy")}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span
                  className={cn(
                    "nd-display tabular-nums leading-none tracking-tighter",
                    isDisplay ? "text-[36px]" : "text-[28px]"
                  )}
                >
                  {format(date, "MM")}
                </span>
                <span className="nd-caption leading-none pb-0.5">月</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span
                  className={cn(
                    "nd-display tabular-nums leading-none tracking-tighter",
                    isDisplay ? "text-[36px]" : "text-[28px]"
                  )}
                >
                  {format(date, "dd")}
                </span>
                <span className="nd-caption leading-none pb-0.5">日</span>
              </div>
            </div>
          ) : (
            <span className="nd-caption">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-auto !p-0 !min-h-0 !backdrop-blur-none",
          "rounded-2xl bg-white dark:bg-zinc-900",
          "border border-zinc-200/80 dark:border-zinc-800",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]"
        )}
      >
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={zhCN}
          initialFocus
          defaultMonth={date || new Date()}
          className={cn(
            "p-3",
            "[--rdp-accent-color:#18181b] [--rdp-accent-color-dark:#fafafa]",
            "[--rdp-background-color:#f4f4f5] [--rdp-background-color-dark:#27272a]",
            "[--rdp-selected-color:#ffffff]",
            "dark:[--rdp-accent-color:#fafafa] dark:[--rdp-background-color:#27272a]",
            "dark:[--rdp-selected-color:#18181b]"
          )}
          classNames={{
            months: "flex flex-col",
            month: "space-y-2",
            caption: "flex justify-center pt-0.5 relative items-center mb-2",
            caption_label:
              "text-[12px] font-medium text-zinc-900 dark:text-zinc-100",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-6.5 w-6.5 bg-transparent p-0 inline-flex items-center justify-center",
              "text-zinc-500 dark:text-zinc-400",
              "rounded-full",
              "hover:bg-zinc-100 hover:text-zinc-900",
              "dark:hover:!bg-zinc-800 dark:hover:!text-zinc-100",
              "transition-[background-color,color] duration-200"
            ),
            nav_button_previous: "absolute left-0.5",
            nav_button_next: "absolute right-0.5",
            table: "w-full border-collapse",
            head_row: "flex mb-1",
            head_cell:
              "w-9 font-medium text-[11.5px] text-zinc-400 dark:text-zinc-500",
            row: "flex w-full mt-0.5",
            cell: "h-9 w-9 text-center text-[12px] p-0 relative",
            day: cn(
              "h-8 w-8 p-0 font-medium rounded-[5px] cursor-pointer",
              "text-[12px] text-zinc-700 dark:text-zinc-300 tabular-nums",
              "transition-[background-color,box-shadow,color] duration-200",
              "hover:bg-zinc-100 hover:text-zinc-900",
              "dark:hover:!bg-zinc-800 dark:hover:!text-zinc-100"
            ),
            day_selected: cn(
              "!bg-zinc-900 !text-white",
              "dark:!bg-zinc-100 dark:!text-zinc-900",
              "hover:!bg-zinc-900 hover:!text-white",
              "dark:hover:!bg-zinc-100 dark:hover:!text-zinc-900",
              "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
            ),
            day_today:
              "ring-1 ring-zinc-300 dark:ring-zinc-600 font-semibold",
            day_outside:
              "text-zinc-300 dark:text-zinc-600 opacity-60",
            day_disabled:
              "text-zinc-300 dark:text-zinc-600 opacity-40 cursor-not-allowed",
            day_hidden: "invisible",
          }}
        />
        {showTodayButton && (
          <div className="border-t border-zinc-200/80 dark:border-zinc-800 px-2 py-2">
            <button
              type="button"
              onClick={handleTodayClick}
              className={cn(
                "flex h-6.5 w-full items-center justify-center rounded-full px-2.5",
                "text-[12px] font-medium text-zinc-600 dark:text-zinc-400",
                "transition-[background-color,box-shadow,color] duration-200",
                "hover:bg-zinc-100 hover:text-zinc-900",
                "dark:hover:!bg-zinc-800 dark:hover:!text-zinc-100"
              )}
            >
              今天
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
