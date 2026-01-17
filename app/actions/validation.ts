"use server"

import { cookies } from "next/headers"

// 检查文件是否存在
export async function checkFileExists(
  type: "post" | "note",
  fileId: string
): Promise<{ exists: boolean; message?: string }> {
  if (!fileId || !fileId.trim()) {
    return { exists: false }
  }

  // 验证文件 ID 格式
  const validIdPattern = /^[a-z0-9_-]+$/
  if (!validIdPattern.test(fileId.toLowerCase())) {
    return {
      exists: false,
      message: "文件 ID 只能包含小写字母、数字、连字符和下划线",
    }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("github_access_token")?.value

  if (!accessToken) {
    return { exists: false }
  }

  const githubOwner = process.env.GITHUB_OWNER || "Lily-404"
  const githubRepo = process.env.GITHUB_REPO || "blog"
  const filePath = type === "post" 
    ? `content/posts/${fileId}.md`
    : `content/notes/${fileId}.md`

  try {
    const response = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    )

    if (response.status === 404) {
      return { exists: false }
    }

    if (response.ok) {
      return { exists: true, message: "文件已存在，提交后将更新现有内容" }
    }

    return { exists: false }
  } catch (error) {
    return { exists: false }
  }
}

// 获取所有标签
export async function getAllTags(): Promise<string[]> {
  // 这里可以调用 GitHub API 获取所有文章的标签
  // 暂时返回空数组，后续可以实现
  return []
}
