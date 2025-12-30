export function NoteSkeleton() {
    return (
      <div className="group relative pb-3 animate-pulse">
        <div className="absolute left-5 top-0 w-px bottom-[-12px] bg-zinc-200 dark:bg-zinc-700 opacity-40" />
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600" />
          </div>
          <div className="flex-1 pt-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-11/12 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-4/6 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }