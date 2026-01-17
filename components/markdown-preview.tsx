"use client"

import { useEffect, useState } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  const [htmlContent, setHtmlContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function processMarkdown() {
      if (!content.trim()) {
        setHtmlContent("")
        return
      }

      setLoading(true)
      try {
        const response = await fetch("/api/markdown", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        })

        if (!response.ok) {
          throw new Error("处理失败")
        }

        const data = await response.json()
        let html = data.html

        // 处理数学公式 - 块级公式 $$...$$
        html = html.replace(/\$\$\$([\s\S]+?)\$\$\$/g, (_, tex) => {
          try {
            return `<div class="katex-block my-4">${katex.renderToString(tex.trim(), {
              displayMode: true,
              throwOnError: false,
            })}</div>`
          } catch {
            return `<div class="katex-block my-4">$$${tex}$$</div>`
          }
        })

        // 处理数学公式 - 行内公式 $...$
        html = html.replace(/\$\$([^\$]+?)\$\$/g, (_, tex) => {
          try {
            return `<span class="katex-inline">${katex.renderToString(tex.trim(), {
              displayMode: false,
              throwOnError: false,
            })}</span>`
          } catch {
            return `<span class="katex-inline">$${tex}$</span>`
          }
        })

        setHtmlContent(html)
      } catch (error) {
        console.error("Markdown 处理错误:", error)
        setHtmlContent("<p class='text-red-500'>预览渲染失败</p>")
      } finally {
        setLoading(false)
      }
    }

    // 防抖处理
    const timer = setTimeout(() => {
      processMarkdown()
    }, 300)

    return () => clearTimeout(timer)
  }, [content])

  if (!content.trim()) {
    return (
      <div className={`text-center text-zinc-400 dark:text-zinc-600 py-12 ${className}`}>
        输入内容后，预览将显示在这里
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`text-center text-zinc-400 dark:text-zinc-600 py-12 ${className}`}>
        渲染中...
      </div>
    )
  }

  return (
    <div
      className={`prose prose-zinc dark:prose-invert prose-sm max-w-none dark:text-zinc-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
