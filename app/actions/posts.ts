"use server"

import { cookies } from "next/headers"

// 检查是否已认证（通过 GitHub OAuth）
export async function checkAuth(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("github_access_token")?.value
  const username = cookieStore.get("github_username")?.value

  if (!accessToken || !username) {
    return { authenticated: false }
  }

  // 验证 token 是否仍然有效
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      // Token 无效，清除 cookie
      clearAuth()
      return { authenticated: false }
    }

    return { authenticated: true, username }
  } catch (error) {
    clearAuth()
    return { authenticated: false }
  }
}

// 获取 GitHub access token
export async function getGitHubToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("github_access_token")?.value || null
}

// 清除认证
export async function clearAuth() {
  const cookieStore = await cookies()
  cookieStore.delete("github_access_token")
  cookieStore.delete("github_username")
}

// 创建博客文章
export async function createPost(formData: {
  title: string
  content: string
  date: string
  tags: string[]
  id?: string
}): Promise<{ success: boolean; message: string; id?: string }> {
  return createContent("post", formData)
}

// 创建随笔
export async function createNote(formData: {
  content: string
  date: string
  id?: string
}): Promise<{ success: boolean; message: string; id?: string }> {
  return createContent("note", formData)
}

// 统一的内容创建函数
async function createContent(
  type: "post" | "note",
  formData: any
): Promise<{ success: boolean; message: string; id?: string }> {
  // 检查认证
  const auth = await checkAuth()
  if (!auth.authenticated) {
    return { success: false, message: "未授权访问，请先登录" }
  }

  // 获取用户的 GitHub access token
  const githubToken = await getGitHubToken()
  if (!githubToken) {
    return { success: false, message: "未找到 GitHub Token，请重新登录" }
  }

  const githubOwner = process.env.GITHUB_OWNER || "Lily-404"
  const githubRepo = process.env.GITHUB_REPO || "blog"

  try {
    // 生成文件 ID
    let fileId: string
    if (formData.id && formData.id.trim()) {
      // 使用用户提供的 ID
      fileId = formData.id.trim().toLowerCase()
    } else if (type === "post" && formData.title && formData.title.trim()) {
      // 从标题生成 ID
      fileId = generateFileId(formData.title)
      // 如果生成的 ID 为空，使用备用方案
      if (!fileId || fileId.trim() === "") {
        fileId = generateFallbackId(type, formData.date)
      }
    } else {
      // 使用备用方案：日期 + 时间戳
      fileId = generateFallbackId(type, formData.date)
    }
    
    // 确保 ID 有效（非空且符合格式）
    if (!fileId || !/^[a-z0-9_-]+$/.test(fileId)) {
      // 如果 ID 仍然无效，使用时间戳作为最后手段
      fileId = `content-${Date.now()}`
    }
    
    // 构建文件路径
    let filePath = type === "post" 
      ? `content/posts/${fileId}.md`
      : `content/notes/${fileId}.md`
    
    // 检查文件是否已存在，如果存在则生成新的唯一 ID
    let attempts = 0
    const maxAttempts = 10 // 最多尝试 10 次
    while (attempts < maxAttempts) {
      const existingFile = await checkFileExists(
        githubOwner,
        githubRepo,
        filePath,
        githubToken
      )
      
      if (!existingFile.exists) {
        // 文件不存在，可以使用这个 ID
        break
      }
      
      // 文件已存在，生成新的 ID
      attempts++
      if (formData.id && formData.id.trim()) {
        // 如果用户提供了 ID，在末尾添加时间戳
        fileId = `${formData.id.trim().toLowerCase()}-${Date.now().toString().slice(-8)}`
      } else {
        // 使用备用方案生成新的 ID
        fileId = generateFallbackId(type, formData.date)
      }
      
      // 更新文件路径
      filePath = type === "post" 
        ? `content/posts/${fileId}.md`
        : `content/notes/${fileId}.md`
    }
    
    // 如果尝试了太多次仍然冲突，使用时间戳作为最后手段
    if (attempts >= maxAttempts) {
      fileId = `${type}-${Date.now()}`
      filePath = type === "post" 
        ? `content/posts/${fileId}.md`
        : `content/notes/${fileId}.md`
    }
    
    const fileName = `${fileId}.md`

    // 构建 Markdown 内容
    let frontmatter: string
    if (type === "post") {
      frontmatter = `---
title: "${escapeYamlString(formData.title)}"
date: "${formData.date}"
tags: ${JSON.stringify(formData.tags || [])}
---

${formData.content}`
    } else {
      // 随笔只有 date
      frontmatter = `---
date: "${formData.date}"
---

${formData.content}`
    }

    // 将内容编码为 base64
    const contentBase64 = Buffer.from(frontmatter, "utf-8").toString("base64")

    // 再次检查文件是否存在（用于更新场景）
    const existingFile = await checkFileExists(
      githubOwner,
      githubRepo,
      filePath,
      githubToken
    )

    let sha: string | undefined
    if (existingFile.exists) {
      sha = existingFile.sha
    }

    // 调用 GitHub API 创建或更新文件
    const response = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: existingFile.exists
            ? `Update ${type === "post" ? "post" : "note"}: ${type === "post" ? formData.title : fileId}`
            : `Add ${type === "post" ? "post" : "note"}: ${type === "post" ? formData.title : fileId}`,
          content: contentBase64,
          sha: sha,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("GitHub API 错误:", error)
      return {
        success: false,
        message: `创建失败: ${error.message || "未知错误"}`,
      }
    }

    // 触发 Vercel 重新部署（可选，通过 GitHub webhook 自动触发）
    return {
      success: true,
      message: existingFile.exists 
        ? `${type === "post" ? "文章" : "随笔"}更新成功` 
        : `${type === "post" ? "文章" : "随笔"}创建成功`,
      id: fileId,
    }
  } catch (error) {
    console.error("创建博客文章时出错:", error)
    return {
      success: false,
      message: `创建失败: ${error instanceof Error ? error.message : "未知错误"}`,
    }
  }
}

// 检查文件是否存在
async function checkFileExists(
  owner: string,
  repo: string,
  path: string,
  token: string
): Promise<{ exists: boolean; sha?: string }> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    )

    if (response.status === 404) {
      return { exists: false }
    }

    if (!response.ok) {
      return { exists: false }
    }

    const data = await response.json()
    return { exists: true, sha: data.sha }
  } catch (error) {
    return { exists: false }
  }
}

// 生成文件 ID（简单实现，可以改进）
function generateFileId(title: string): string {
  // 移除特殊字符，转换为小写，用连字符替换空格
  let id = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 移除特殊字符
    .replace(/\s+/g, "-") // 空格替换为连字符
    .replace(/-+/g, "-") // 合并多个连字符
    .replace(/^-|-$/g, "") // 移除首尾连字符
    .trim()
    .substring(0, 50) // 限制长度
  
  // 确保 ID 不为空
  if (!id || id.length === 0) {
    return ""
  }
  
  return id
}

// 生成备用文件 ID（当标题生成失败时使用）
function generateFallbackId(type: "post" | "note", date: string): string {
  const dateStr = date.replace(/-/g, "")
  const timestamp = Date.now().toString().slice(-8) // 使用后 8 位时间戳
  const randomSuffix = Math.random().toString(36).substring(2, 6) // 添加随机后缀确保唯一性
  const prefix = type === "post" ? "post" : "note"
  return `${prefix}-${dateStr}-${timestamp}-${randomSuffix}`
}

// 转义 YAML 字符串
function escapeYamlString(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, "\\n")
}
