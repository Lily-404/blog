"use client"

import { useEffect, useState } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

export interface UseMarkdownHtmlOptions {
  trimStart?: boolean
  debounceMs?: number
  blockFormulaClass?: string
}

export interface UseMarkdownHtmlReturn {
  html: string
  loading: boolean
  error: string | null
}

function processKatex(
  html: string,
  blockClass: string = "katex-block my-4"
): string {
  let out = html
  out = out.replace(/\$\$\$([\s\S]+?)\$\$\$/g, (_, tex: string) => {
    try {
      return `<div class="${blockClass}">${katex.renderToString(tex.trim(), {
        displayMode: true,
        throwOnError: false,
      })}</div>`
    } catch {
      return `<div class="${blockClass}">$$${tex}$$</div>`
    }
  })
  out = out.replace(/\$\$([^\$]+?)\$\$/g, (_, tex: string) => {
    try {
      return `<span class="katex-inline">${katex.renderToString(tex.trim(), {
        displayMode: false,
        throwOnError: false,
      })}</span>`
    } catch {
      return `<span class="katex-inline">$${tex}$</span>`
    }
  })
  return out
}

export function useMarkdownHtml(
  content: string,
  options: UseMarkdownHtmlOptions = {}
): UseMarkdownHtmlReturn {
  const {
    trimStart = false,
    debounceMs = 300,
    blockFormulaClass = "katex-block my-4",
  } = options

  const [html, setHtml] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!content.trim()) {
      setHtml("")
      setLoading(false)
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const body = trimStart ? content.trimStart() : content
        const res = await fetch("/api/markdown", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: body }),
        })
        if (!res.ok) throw new Error("处理失败")
        const data = await res.json()
        const processed = processKatex(data.html, blockFormulaClass)
        setHtml(processed)
      } catch (e) {
        console.error("Markdown 处理错误:", e)
        setError("预览渲染失败")
        setHtml("<p class='text-red-500'>预览渲染失败</p>")
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [content, trimStart, debounceMs, blockFormulaClass])

  return { html, loading, error }
}
