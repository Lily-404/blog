"use client"

import type { MarkdownContentProps } from "@/types/markdown"
import { useCodeBlockCopy } from "@/hooks/use-code-block-copy"
import { MarkdownProse } from "@/components/ui/markdown-prose"
import { processMathFormulas } from "@/lib/math-formulas"

export function MarkdownContent({ content }: MarkdownContentProps) {
  useCodeBlockCopy()
  const html = processMathFormulas(content)
  return <MarkdownProse html={html} />
}