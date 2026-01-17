import type { NoteMeta } from "@/app/lib/content"

export type NotesPaginationProps = {
  initialNotes: NoteMeta[];
  initialTotal: number;
  initialPage: number;
  totalPages: number;
}