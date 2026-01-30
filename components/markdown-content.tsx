"use client"

import type { MarkdownContentProps } from "@/types/markdown"
import { useCodeBlockCopy } from "@/hooks/use-code-block-copy"
import { useMarkdownImages } from "@/hooks/use-markdown-images"
import { MarkdownProse } from "@/components/ui/markdown-prose"
import { processMathFormulas } from "@/lib/math-formulas"

export function MarkdownContent({ content }: MarkdownContentProps) {
  useCodeBlockCopy()
  useMarkdownImages()
  const html = processMathFormulas(content)
  return <MarkdownProse html={html} />
}