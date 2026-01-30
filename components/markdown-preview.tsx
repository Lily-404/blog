"use client"

import { useMarkdownHtml } from "@/hooks/use-markdown-html"
import { useMarkdownImages } from "@/hooks/use-markdown-images"
import { MarkdownProse } from "@/components/ui/markdown-prose"
import { PreviewPlaceholder } from "@/components/ui/preview-placeholder"

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  const { html, loading } = useMarkdownHtml(content, {
    blockFormulaClass: "katex-block my-4",
  })

  useMarkdownImages({ enabled: !!html })

  if (!content.trim()) {
    return (
      <PreviewPlaceholder
        message="开始创作，点亮灵感✨"
        className={className}
      />
    )
  }

  if (loading) {
    return (
      <PreviewPlaceholder message="渲染中..." className={className} />
    )
  }

  return <MarkdownProse html={html} className={className} />
}
