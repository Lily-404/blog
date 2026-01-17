"use client"

import { useEffect, useState } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface PostPreviewProps {
  content: string
}

export function PostPreview({ content }: PostPreviewProps) {
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
            return `<div class="katex-block">${katex.renderToString(tex.trim(), {
              displayMode: true,
              throwOnError: false,
            })}</div>`
          } catch {
            return `<div class="katex-block">$$${tex}$$</div>`
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

  useEffect(() => {
    if (!htmlContent) return

    // 为所有代码块添加复制按钮（与 MarkdownContent 一致）
    const codeBlocks = document.querySelectorAll("pre")

    codeBlocks.forEach((pre) => {
      // 检查是否已经添加过按钮
      if (pre.parentElement?.classList.contains("relative")) {
        return
      }

      // 创建外层容器
      const wrapper = document.createElement("div")
      wrapper.className = "relative mb-6 group"

      // 创建复制按钮容器
      const buttonContainer = document.createElement("div")
      buttonContainer.className =
        "absolute right-3 top-3 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"

      // 创建复制按钮
      const copyButton = document.createElement("button")
      copyButton.className =
        "p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100"
      copyButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'

      // 创建成功提示按钮
      const successButton = document.createElement("button")
      successButton.className =
        "p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100 hidden"
      successButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

      // 添加点击事件
      copyButton.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.textContent || ""
        try {
          await navigator.clipboard.writeText(code)

          // 立即更新UI状态
          copyButton.style.display = "none"
          successButton.style.display = "block"

          // 2秒后恢复原始状态
          setTimeout(() => {
            copyButton.style.display = "block"
            successButton.style.display = "none"
          }, 2000)
        } catch (err) {
          console.error("Failed to copy code:", err)
        }
      })

      // 添加元素到容器
      buttonContainer.appendChild(copyButton)
      buttonContainer.appendChild(successButton)

      // 将代码块包装在外层容器中
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(buttonContainer)
    })

    // 清理函数
    return () => {
      const wrappers = document.querySelectorAll("div.relative.mb-6.group")
      wrappers.forEach((wrapper) => {
        const pre = wrapper.querySelector("pre")
        if (pre) {
          wrapper.parentNode?.insertBefore(pre, wrapper)
        }
        wrapper.remove()
      })
    }
  }, [htmlContent])

  if (!content.trim()) {
    return (
      <div className="text-center text-zinc-400 dark:text-zinc-600 py-12">
        输入内容后，预览将显示在这里
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center text-zinc-400 dark:text-zinc-600 py-12">
        渲染中...
      </div>
    )
  }

  return (
    <div
      className="prose prose-zinc dark:prose-invert prose-sm max-w-none dark:text-zinc-200"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
