import { NextResponse } from "next/server"
import { checkFileExists } from "@/app/actions/validation"

export async function POST(request: Request) {
  try {
    const { type, fileId } = await request.json()

    if (!type || !fileId) {
      return NextResponse.json(
        { error: "缺少参数" },
        { status: 400 }
      )
    }

    const result = await checkFileExists(type as "post" | "note", fileId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("检查文件存在性时出错:", error)
    return NextResponse.json(
      { error: "检查失败" },
      { status: 500 }
    )
  }
}
