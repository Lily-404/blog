export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-zinc-200 border-t-zinc-800 dark:border-zinc-700 dark:border-t-zinc-300"></div>
      </div>
    </div>
  )
} 