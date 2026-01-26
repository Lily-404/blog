import { NoteTimelineBlock } from "@/components/ui/note-timeline-block"

export function NoteSkeleton() {
  return (
    <NoteTimelineBlock
      variant="skeleton"
      avatar={
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600" />
      }
      meta={
        <>
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </>
      }
    >
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-10/12" />
    </NoteTimelineBlock>
  )
}

