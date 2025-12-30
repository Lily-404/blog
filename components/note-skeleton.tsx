export function NoteSkeleton() {
  return (
    <div className="flex items-start gap-3 py-4 animate-pulse">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-3">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        
        <div className="space-y-2.5">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-10/12" />
        </div>
      </div>
    </div>
  )
}