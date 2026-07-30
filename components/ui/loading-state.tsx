"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * LOADING STATE — pixel-grid loader for long-running work
 *
 * Variants:
 *   Drive  — square cells, chevron wavefront driving right;
 *            the 650ms cycle is shorter than the sweep, so
 *            two fronts are always in flight
 *   Dots   — same wavefront, circular cells
 *   Orbit  — a comet lapping the grid perimeter
 *
 * Paired with a shimmering label and a live elapsed timer
 * in mono tabular figures. Reduced motion freezes the grid
 * to its dim state; the timer still ticks.
 * ───────────────────────────────────────────────────────── */

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3)
  const c = i % 3
  return (c + Math.abs(r - 1)) * 90
})

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3]
const orbit = Array.from({ length: 9 }, (_, i) => {
  const k = ORBIT_ORDER.indexOf(i)
  return k === -1 ? null : k * 110
})

const PATTERNS: Record<
  string,
  { delays: (number | null)[]; dur: number; round: boolean }
> = {
  Drive: { delays: chevron, dur: 650, round: false },
  Dots: { delays: chevron, dur: 650, round: true },
  Orbit: { delays: orbit, dur: 950, round: false },
}

function useElapsed() {
  const [ds, setDs] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setDs((d) => d + 1), 100)
    return () => clearInterval(t)
  }, [])
  const total = ds / 10
  if (total < 60) return `${total.toFixed(1)}s`
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`
}

export type LoadingStateVariant = "Drive" | "Dots" | "Orbit"

export function LoadingState({
  label = "加载中",
  variant = "Drive",
  className,
}: {
  label?: string
  variant?: LoadingStateVariant | string
  className?: string
}) {
  const elapsed = useElapsed()
  const { delays, dur, round } = PATTERNS[variant] ?? PATTERNS.Drive

  return (
    <div
      className={cn("loading-state flex w-fit items-center gap-2.5", className)}
      role="status"
      aria-live="polite"
      aria-label={`${label} ${elapsed}`}
    >
      <span aria-hidden className="grid grid-cols-[repeat(3,4px)] gap-[1.5px]">
        {delays.map((d, i) => (
          <span
            key={i}
            className={cn(
              "loading-state-cell size-[4px] bg-zinc-900 dark:bg-zinc-100",
              round ? "rounded-full" : "rounded-[1px]"
            )}
            style={{
              opacity: d === null ? 0.07 : 0.15,
              animation:
                d === null ? "none" : `pixel-on ${dur}ms ease-in-out ${d}ms infinite`,
            }}
          />
        ))}
      </span>
      <span className="loading-state-label bg-clip-text text-[13px] font-medium text-transparent">
        {label}
      </span>
      <span className="font-mono text-[12px] text-zinc-400 dark:text-zinc-500 tabular-nums">
        {elapsed}
      </span>
    </div>
  )
}

export default LoadingState
