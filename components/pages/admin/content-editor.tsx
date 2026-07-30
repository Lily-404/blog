"use client"

import { useRef } from "react"
import { PostPreview } from "@/components/post-preview"
import { cn } from "@/lib/utils"

type ViewMode = "edit" | "preview" | "split"

interface ContentEditorProps {
  content: string
  viewMode: ViewMode
  onContentChange: (content: string) => void
}

export function ContentEditor({
  content,
  viewMode,
  onContentChange,
}: ContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  if (viewMode === "split") {
    return (
      <div className="nd-surface overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col min-w-0 min-h-[55vh] h-[55vh] lg:min-h-0 lg:h-[600px]">
          <div className="px-4 pt-3 pb-1">
            <p className="nd-label">编辑</p>
          </div>
          <textarea
            ref={textareaRef}
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="nd-textarea flex-1 px-4 py-2 overflow-y-auto"
            placeholder="粘贴或输入 Markdown 内容..."
            required
          />
        </div>
        <div
          ref={previewRef}
          className={cn(
            "flex-1 flex flex-col min-w-0 overflow-y-auto px-4 py-3",
            "min-h-[45vh] h-[45vh] lg:min-h-0 lg:h-[600px]",
            "border-t border-[var(--nd-border)] lg:border-t-0 lg:border-l"
          )}
        >
          <p className="nd-label mb-2">预览</p>
          <PostPreview content={content} />
        </div>
      </div>
    )
  }

  if (viewMode === "edit") {
    return (
      <div className="nd-surface overflow-hidden">
        <div className="px-4 pt-3 pb-1">
          <p className="nd-label">编辑</p>
        </div>
        <textarea
          ref={textareaRef}
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="nd-textarea px-4 py-2 min-h-[70vh] lg:min-h-[600px] overflow-y-auto"
          placeholder="粘贴或输入 Markdown 内容..."
          required
        />
      </div>
    )
  }

  return (
    <div className="nd-surface overflow-hidden" style={{ background: "var(--nd-surface-raised)" }}>
      <div ref={previewRef} className="px-4 py-3 min-h-[70vh] lg:min-h-[600px] overflow-y-auto">
        <p className="nd-label mb-2">预览</p>
        <PostPreview content={content} />
      </div>
    </div>
  )
}
