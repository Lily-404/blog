import { NextResponse } from "next/server"
import { getAllPostsList } from "@/app/actions/posts"

export async function GET() {
  try {
    const result = await getAllPostsList()
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "获取文章列表失败" },
        { status: 401 }
      )
    }
    return NextResponse.json(result.posts || [])
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "获取文章列表失败" },
      { status: 500 }
    )
  }
}
