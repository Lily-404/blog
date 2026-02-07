import { format } from "date-fns"
import type { NoteMeta as Note } from "@/app/lib/content"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { NoteTimelineBlock, NOTE_AVATAR_CLASSES } from "@/components/ui/note-timeline-block"

export function NoteCard({ note, isLast }: { note: Note; isLast?: boolean }) {
  return (
    <NoteTimelineBlock
      isLast={isLast}
      avatar={
        <OptimizedImage
          src="/cat.jpg"
          alt="Jimmy's avatar"
          width={40}
          height={40}
          className={NOTE_AVATAR_CLASSES}
          sizes="40px"
          quality={85}
        />
      }
      meta={
        <>
          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Jimmy</div>
          <time className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
            {format(new Date(note.date), "yyyy/MM/dd")}
          </time>
        </>
      }
      contentClassName="whitespace-pre-wrap"
    >
      {note.content}
    </NoteTimelineBlock>
  )
}

