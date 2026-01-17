import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

// 统一的缓存接口
interface CacheItem<T> {
  data: T
  lastUpdated: number
}

// 全局缓存
const cache = new Map<string, CacheItem<any>>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存（开发环境），生产环境使用静态生成

// 通用文件读取函数
function readMarkdownFiles<T>(
  directory: string,
  transform: (id: string, matterResult: matter.GrayMatterFile<string>) => T
): T[] {
  const cacheKey = `files:${directory}`
  const cached = cache.get(cacheKey)
  
  // 检查缓存
  if (cached && Date.now() - cached.lastUpdated < CACHE_DURATION) {
    return cached.data
  }

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
    const empty: T[] = []
    cache.set(cacheKey, { data: empty, lastUpdated: Date.now() })
    return empty
  }

  const fileNames = fs.readdirSync(directory)
  const items = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "")
      const fullPath = path.join(directory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)
      return transform(id, matterResult)
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      return dateB - dateA // 最新的在前
    })

  cache.set(cacheKey, { data: items, lastUpdated: Date.now() })
  return items
}

// Posts 相关
const postsDirectory = path.join(process.cwd(), "content/posts")

export interface PostMeta {
  id: string
  title: string
  date: string
  tags: string[]
}

export interface Post extends PostMeta {
  content: string
  excerpt: string
}

export function getAllPostsMeta(): PostMeta[] {
  return readMarkdownFiles<PostMeta>(postsDirectory, (id, matterResult) => ({
    id,
    title: matterResult.data.title || "无标题",
    date: matterResult.data.date 
      ? new Date(matterResult.data.date).toISOString() 
      : new Date().toISOString(),
    tags: matterResult.data.tags || [],
  }))
}

export function getAllPosts(): Post[] {
  return readMarkdownFiles<Post>(postsDirectory, (id, matterResult) => {
    // 去掉内容开头的换行符，实现所见即所得
    const trimmedContent = matterResult.content.trimStart()
    return {
      id,
      title: matterResult.data.title || "无标题",
      date: matterResult.data.date 
        ? new Date(matterResult.data.date).toISOString() 
        : new Date().toISOString(),
      tags: matterResult.data.tags || [],
      content: trimmedContent,
      excerpt: matterResult.data.excerpt || trimmedContent.slice(0, 200) + "...",
    }
  })
}

export async function getPostById(id: string): Promise<{
  id: string
  title: string
  date: string
  contentHtml: string
  tags: string[]
  [key: string]: any
} | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    if (!fs.existsSync(fullPath)) return null
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)
    
    // 去掉内容开头的换行符，实现所见即所得
    const trimmedContent = matterResult.content.trimStart()
    
    // 使用remark将Markdown转换为HTML
    const processedContent = await remark().use(remarkGfm).use(html).process(trimmedContent)
    const contentHtml = processedContent.toString()
    
    return {
      id,
      title: matterResult.data.title || "无标题",
      date: matterResult.data.date 
        ? new Date(matterResult.data.date).toISOString() 
        : new Date().toISOString(),
      contentHtml,
      tags: matterResult.data.tags || [],
      ...matterResult.data,
    }
  } catch (error) {
    console.error(`获取博客文章 ${id} 失败:`, error)
    return null
  }
}

export function getAllPostIds() {
  return getAllPostsMeta().map((post) => ({
    id: post.id,
  }))
}

export function getPostsByYear() {
  const posts = getAllPostsMeta()
  const postsByYear: Record<string, PostMeta[]> = {}
  
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })
  
  return postsByYear
}

export function getAllTags() {
  const posts = getAllPostsMeta()
  const tagCounts: Record<string, number> = {}
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getTagsFromPosts(posts: PostMeta[]) {
  const tagCounts: Record<string, number> = {}
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
}

// Notes 相关
const notesDirectory = path.join(process.cwd(), "content/notes")

export interface NoteMeta {
  id: string
  content: string
  date: string
}

export interface Note extends NoteMeta {}

export function getAllNotesMeta(): NoteMeta[] {
  return readMarkdownFiles<NoteMeta>(notesDirectory, (id, matterResult) => ({
    id,
    content: matterResult.content.trimStart(), // 去掉内容开头的换行符
    date: matterResult.data.date 
      ? new Date(matterResult.data.date).toISOString() 
      : new Date().toISOString(),
  }))
}

export function getAllNotes(): Note[] {
  return getAllNotesMeta()
}

// 清除缓存（用于开发时强制刷新）
export function clearCache() {
  cache.clear()
}
