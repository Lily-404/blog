export type ContentType = "post" | "note"

// 统一的文件 ID 格式校验规则：仅允许小写字母、数字、连字符和下划线
export const FILE_ID_PATTERN = /^[a-z0-9_-]+$/

// 将输入规范化为合法的文件 ID（用于表单输入/展示）
export function formatFileIdInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-") // 非法字符替换为连字符
    .replace(/-+/g, "-") // 合并多个连字符
    .replace(/^-|-$/g, "") // 移除首尾连字符
}

// 根据标题生成文件 ID（slug），用于文章标题自动生成
export function generateFileId(title: string): string {
  let id = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 移除特殊字符
    .replace(/\s+/g, "-") // 空格替换为连字符
    .replace(/-+/g, "-") // 合并多个连字符
    .replace(/^-|-$/g, "") // 移除首尾连字符
    .trim()
    .substring(0, 50) // 限制长度

  if (!id || id.length === 0) {
    return ""
  }

  return id
}

// 标题生成失败时的备用 ID：类型 + 日期 + 时间戳 + 随机后缀
export function generateFallbackId(type: ContentType, date: string): string {
  const dateStr = date.replace(/-/g, "")
  const timestamp = Date.now().toString().slice(-8) // 使用后 8 位时间戳
  const randomSuffix = Math.random().toString(36).substring(2, 6) // 随机后缀确保唯一性
  const prefix = type === "post" ? "post" : "note"
  return `${prefix}-${dateStr}-${timestamp}-${randomSuffix}`
}

