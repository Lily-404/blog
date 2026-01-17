import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 动态获取基础 URL
function getBaseUrl(request: Request): string {
  // 优先使用环境变量
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  // 从请求中获取 origin（自动适配本地和生产环境）
  try {
    const url = new URL(request.url)
    return `${url.protocol}//${url.host}`
  } catch {
    // 如果无法解析，使用默认值
    return process.env.NODE_ENV === 'production' 
      ? 'https://www.jimmy-blog.top'
      : 'http://localhost:3000'
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // 动态获取基础 URL
  const baseUrl = getBaseUrl(request)
  const adminUrl = `${baseUrl}/admin`

  // 检查是否有错误
  if (error) {
    return NextResponse.redirect(
      `${adminUrl}?error=${encodeURIComponent(error)}`,
      { status: 302 }
    )
  }

  // 验证 state
  const cookieStore = await cookies()
  const savedState = cookieStore.get("github_oauth_state")?.value

  if (!state || state !== savedState) {
    return NextResponse.redirect(
      `${adminUrl}?error=${encodeURIComponent("状态验证失败")}`,
      { status: 302 }
    )
  }

  // 清除 state cookie
  cookieStore.delete("github_oauth_state")

  if (!code) {
    return NextResponse.redirect(
      `${adminUrl}?error=${encodeURIComponent("未收到授权码")}`,
      { status: 302 }
    )
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${adminUrl}?error=${encodeURIComponent("OAuth 配置不完整")}`,
      { status: 302 }
    )
  }

  // 带超时和重试的 fetch 函数
  async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    timeout = 30000
  ): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return response
      } catch (error: any) {
        if (i === retries - 1) {
          throw error
        }
        // 等待后重试（指数退避）
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw new Error("重试次数已用完")
  }

  try {
    // 使用授权码换取 access token（增加超时时间和重试机制）
    const tokenResponse = await fetchWithRetry(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
      3, // 重试 3 次
      30000 // 30 秒超时
    )

    if (!tokenResponse.ok) {
      throw new Error("获取 access token 失败")
    }

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error)
    }

    const accessToken = tokenData.access_token

    // 获取用户信息（增加超时时间和重试机制）
    const userResponse = await fetchWithRetry(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
      3, // 重试 3 次
      30000 // 30 秒超时
    )

    if (!userResponse.ok) {
      throw new Error("获取用户信息失败")
    }

    const userData = await userResponse.json()
    const username = userData.login

    // 验证用户是否是仓库所有者/协作者
    const githubOwner = process.env.GITHUB_OWNER || "Lily-404"
    const githubRepo = process.env.GITHUB_REPO || "blog"

    // 检查是否是仓库所有者
    if (username.toLowerCase() !== githubOwner.toLowerCase()) {
      // 检查是否是协作者（有写权限，增加超时时间和重试机制）
      const collabResponse = await fetchWithRetry(
        `https://api.github.com/repos/${githubOwner}/${githubRepo}/collaborators/${username}`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
        3, // 重试 3 次
        30000 // 30 秒超时
      )

      // 如果不是协作者（404），直接拒绝访问
      if (collabResponse.status === 404) {
        return NextResponse.redirect(
          `${adminUrl}?error=${encodeURIComponent("您没有访问此仓库的权限。只有仓库所有者或协作者才能访问。")}`,
          { status: 302 }
        )
      }

      // 如果检查协作者时出错，也拒绝访问
      if (!collabResponse.ok) {
        return NextResponse.redirect(
          `${adminUrl}?error=${encodeURIComponent("权限验证失败")}`,
          { status: 302 }
        )
      }

      // 验证协作者是否有写权限（push 权限）
      try {
        const collabData = await collabResponse.json()
        // GitHub API 返回的 permissions 对象包含 push 权限
        if (collabData.permissions && !collabData.permissions.push) {
          return NextResponse.redirect(
            `${adminUrl}?error=${encodeURIComponent("您没有写权限。需要 push 权限才能创建内容。")}`,
            { status: 302 }
          )
        }
      } catch (error) {
        // 如果无法解析协作者数据，继续（可能是旧版 API）
      }
    }

    // 保存认证信息到 cookie
    cookieStore.set("github_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天（GitHub token 通常有效期更长）
    })

    cookieStore.set("github_username", username, {
      httpOnly: false, // 允许客户端读取用户名用于显示
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    // 重定向到管理页面（使用 302 明确状态码，避免某些浏览器问题）
    return NextResponse.redirect(
      `${adminUrl}?success=${encodeURIComponent("登录成功")}`,
      { status: 302 }
    )
  } catch (error) {
    console.error("OAuth 回调错误:", error)
    
    // 根据错误类型提供更友好的错误信息
    let errorMessage = "认证失败"
    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout") || error.message.includes("Timeout")) {
        errorMessage = "连接超时，请检查网络连接后重试。如果问题持续，可能是 GitHub API 暂时不可用。"
      } else if (error.message.includes("fetch failed") || error.message.includes("Connect")) {
        errorMessage = "无法连接到 GitHub，请检查网络连接。如果使用代理，请确保代理配置正确。"
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.redirect(
      `${adminUrl}?error=${encodeURIComponent(errorMessage)}`,
      { status: 302 }
    )
  }
}
