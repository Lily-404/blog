"use client"

import { IconButton } from "@/components/ui/icon-button"
import { PageNumberButton } from "@/components/ui/page-number-button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaginationButtonsProps } from "@/types/pagination"

export function PaginationButtons({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationButtonsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <IconButton
        icon={ChevronLeft}
        size="md"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="上一页"
      />
      <div className="flex items-center gap-3">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1
          const shouldShow =
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(pageNumber - currentPage) <= 1

          if (!shouldShow) {
            if (
              (pageNumber === 2 && currentPage > 3) ||
              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return (
                <span
                  key={`ellipsis-${pageNumber}`}
                  className="flex h-8 w-8 items-center justify-center text-xs text-zinc-400 dark:text-zinc-500"
                >
                  •••
                </span>
              )
            }
            return null
          }

          return (
            <PageNumberButton
              key={pageNumber}
              pageNumber={pageNumber}
              active={currentPage === pageNumber}
              onClick={() => onPageChange(pageNumber)}
              size="md"
            />
          )
        })}
      </div>
      <IconButton
        icon={ChevronRight}
        size="md"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="下一页"
      />
    </div>
  )
}
