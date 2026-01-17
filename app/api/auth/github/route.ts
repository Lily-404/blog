import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 动态获取基础 URL
function getBaseUrl(request: Request | null = null): string {
  // 优先使用环境变量
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  // 如果有请求对象，从请求中获取 origin
  if (request) {
    try {
      const url = new URL(request.url)
      return `${url.protocol}//${url.host}`
    } catch {
      // 忽略错误，继续使用默认值
    }
  }
  
  // 默认值：根据环境判断
  return process.env.NODE_ENV === 'production' 
    ? 'https://www.jimmy-blog.top'
    : 'http://localhost:3000'
}

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const baseUrl = getBaseUrl(request)
  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${baseUrl}/api/auth/github/callback`
  
  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth 未配置" },
      { status: 500 }
    )
  }

  // 生成 state 用于防止 CSRF 攻击
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
  // 保存 state 到 cookie
  const cookieStore = await cookies()
  cookieStore.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10分钟
  })

  // 构建 GitHub OAuth URL
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state}`

  return NextResponse.redirect(githubAuthUrl)
}
