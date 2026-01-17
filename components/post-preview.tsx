"use client"

import { useEffect, useState, useMemo } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface PostPreviewProps {
  content: string
}

const emptyMessages = [
  "空白页等待被填满，让文字在指尖流淌",
  "等待你的第一行文字，让想法在这里落地生根",
  "让思绪化作文字，在这片空白中自由生长",
  "每一个字都是种子，等待在纸上开出花来",
  "静待你的笔触，为这空白注入生命",
  "文字是时间的容器，等待被你的故事填满",
  "让灵感在这里栖息，让文字在这里起舞",
  "空白是最大的可能，等待你的第一笔",
]

const loadingMessages = [
  "文字正在成形，思绪正在沉淀...",
  "墨迹未干，文字正在流淌...",
  "思绪正在编织成文...",
  "文字在纸上慢慢浮现...",
  "让文字慢慢沉淀，让想法渐渐清晰...",
  "思绪如云，正在凝结成字...",
]

export function PostPreview({ content }: PostPreviewProps) {
  const [htmlContent, setHtmlContent] = useState("")
  const [loading, setLoading] = useState(false)
  
  // 随机选择空内容和加载时的文案
  const emptyMessage = useMemo(() => {
    return emptyMessages[Math.floor(Math.random() * emptyMessages.length)]
  }, [])
  
  const loadingMessage = useMemo(() => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  }, [])

  useEffect(() => {
    async function processMarkdown() {
      if (!content.trim()) {
        setHtmlContent("")
        return
      }

      setLoading(true)
      try {
        // 去掉内容开头的换行符，实现所见即所得
        const trimmedContent = content.trimStart()
        
        const response = await fetch("/api/markdown", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: trimmedContent }),
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
      <div className="text-center text-zinc-400 dark:text-zinc-600 py-12 italic">
        {emptyMessage}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center text-zinc-400 dark:text-zinc-600 py-12 italic">
        {loadingMessage}
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
