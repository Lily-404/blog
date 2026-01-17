import { NextResponse } from "next/server"
import { checkAuth } from "@/app/actions/posts"

export async function GET() {
  try {
    const auth = await checkAuth()
    return NextResponse.json(auth)
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
