"use server"

import { getAllNotesMeta, type NoteMeta } from "@/app/lib/content"

export async function getPaginatedNotesAction(page: number = 1, pageSize: number = 10) {
  const allNotes = getAllNotesMeta()
  const start = (page - 1) * pageSize
  const paginatedNotes = allNotes.slice(start, start + pageSize)

  return {
    notes: paginatedNotes,
    total: allNotes.length,
    totalPages: Math.ceil(allNotes.length / pageSize)
  }
}