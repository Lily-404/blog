import { NextResponse } from "next/server"
import { getAllNotesList } from "@/app/actions/posts"

export async function GET() {
  try {
    const result = await getAllNotesList()
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "获取随笔列表失败" },
        { status: 401 }
      )
    }
    return NextResponse.json(result.notes || [])
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      { error: "获取随笔列表失败" },
      { status: 500 }
    )
  }
}
