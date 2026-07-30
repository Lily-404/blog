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
          "nd w-auto !p-0 !shadow-none !backdrop-blur-none !min-h-0",
          "!bg-[var(--nd-surface)] !border-[var(--nd-border-visible)] !rounded-xl"
        )}
      >
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={zhCN}
          initialFocus
          defaultMonth={date || new Date()}
          className="p-3"
          classNames={{
            months: "flex flex-col",
            month: "space-y-3",
            caption: "flex justify-center pt-1 relative items-center mb-2",
            caption_label: "nd-mono text-[13px] text-[var(--nd-text-display)]",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-8 w-8 bg-transparent p-0 inline-flex items-center justify-center",
              "text-[var(--nd-text-secondary)] hover:text-[var(--nd-text-display)]",
              "rounded-full border border-transparent hover:border-[var(--nd-border-visible)]",
              "transition-colors duration-200"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex mb-1",
            head_cell:
              "nd-mono text-[10px] tracking-wider uppercase text-[var(--nd-text-disabled)] w-9 font-normal",
            row: "flex w-full mt-1",
            cell: "h-9 w-9 text-center text-sm p-0 relative",
            day: cn(
              "h-9 w-9 p-0 font-normal rounded-full cursor-pointer transition-colors duration-150",
              "nd-mono text-[12px] text-[var(--nd-text-primary)]",
              "hover:bg-[var(--nd-surface-raised)]"
            ),
            day_selected: cn(
              "!bg-[var(--nd-text-display)] !text-[var(--nd-black)]",
              "hover:!bg-[var(--nd-text-display)] hover:!opacity-90"
            ),
            day_today:
              "border border-[var(--nd-border-visible)] font-medium",
            day_outside: "text-[var(--nd-text-disabled)] opacity-40",
            day_disabled: "text-[var(--nd-text-disabled)] opacity-40 cursor-not-allowed",
            day_hidden: "invisible",
          }}
        />
        {showTodayButton && (
          <div className="border-t border-[var(--nd-border)] p-2">
            <button
              type="button"
              onClick={handleTodayClick}
              className="nd-btn nd-btn-ghost w-full !min-h-[36px] !text-[11px]"
            >
              今天
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
