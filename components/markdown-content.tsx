"use client"

import katex from "katex"
import "katex/dist/katex.min.css"
import type { MarkdownContentProps } from "@/types/markdown"
import { useCodeBlockCopy } from "@/hooks/use-code-block-copy"
import { MarkdownProse } from "@/components/ui/markdown-prose"

function processContent(content: string): string {
  const renderMath = (tex: string, displayMode: boolean) => {
    try {
      return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
      })
    } catch (e) {
      console.error("KaTeX error:", e)
      return tex
    }
  }
  let out = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    return `<div class="katex-block">${renderMath(tex.trim(), true)}</div>`
  })
  out = out.replace(/\$([^\$]+?)\$/g, (_, tex) => {
    return `<span class="katex-inline">${renderMath(tex.trim(), false)}</span>`
  })
  return out
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  useCodeBlockCopy()
  return <MarkdownProse html={processContent(content)} />
}