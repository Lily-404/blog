/** 返回本地 YYYY-MM-DD */
export function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/** 按日期统计文章+随笔数量 */
export function buildCountMap(
  posts: { date: string }[],
  notes: { date: string }[] = []
): Record<string, number> {
  const map: Record<string, number> = {}
  posts.forEach((p) => {
    const key = getDateKey(new Date(p.date))
    map[key] = (map[key] ?? 0) + 1
  })
  notes.forEach((n) => {
    const key = getDateKey(new Date(n.date))
    map[key] = (map[key] ?? 0) + 1
  })
  return map
}

/** 固定分级：0 / 1 / 2 / 3+，用于月历热力图 */
export function getDotClassFixed(count: number): string {
  if (!count) return "bg-zinc-100 dark:bg-zinc-800"
  if (count === 1) return "bg-zinc-400 dark:bg-zinc-600"
  if (count === 2) return "bg-zinc-600 dark:bg-zinc-400"
  return "bg-black dark:bg-white"
}

/** 相对分级：按 maxCount 比例，用于 mini 热力图 */
export function getDotClassRelative(count: number, maxCount: number): string {
  if (!count) return "bg-zinc-200 dark:bg-zinc-800"
  const intensity = count / maxCount
  if (intensity <= 0.25) return "bg-zinc-400 dark:bg-zinc-600"
  if (intensity <= 0.5) return "bg-zinc-600 dark:bg-zinc-400"
  if (intensity <= 0.75) return "bg-zinc-800 dark:bg-zinc-200"
  return "bg-zinc-950 dark:bg-zinc-50"
}
