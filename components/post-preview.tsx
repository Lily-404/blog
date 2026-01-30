"use client"

import { useMemo } from "react"
import { useMarkdownHtml } from "@/hooks/use-markdown-html"
import { useCodeBlockCopy } from "@/hooks/use-code-block-copy"
import { useMarkdownImages } from "@/hooks/use-markdown-images"
import { MarkdownProse } from "@/components/ui/markdown-prose"
import { PreviewPlaceholder } from "@/components/ui/preview-placeholder"

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
  const { html, loading } = useMarkdownHtml(content, {
    trimStart: true,
    blockFormulaClass: "katex-block",
  })

  useCodeBlockCopy({ enabled: !!html })
  useMarkdownImages({ enabled: !!html })

  const emptyMessage = useMemo(
    () => emptyMessages[Math.floor(Math.random() * emptyMessages.length)],
    []
  )
  const loadingMessage = useMemo(
    () => loadingMessages[Math.floor(Math.random() * loadingMessages.length)],
    []
  )

  if (!content.trim()) {
    return (
      <PreviewPlaceholder message={emptyMessage} italic />
    )
  }

  if (loading) {
    return (
      <PreviewPlaceholder message={loadingMessage} italic />
    )
  }

  return <MarkdownProse html={html} />
}
