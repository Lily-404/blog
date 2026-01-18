"use client"

import { useRef } from "react"
import { PostPreview } from "@/components/post-preview"

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
      <div className="py-4">
        <div className="flex flex-col lg:flex-row rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* 编辑区域 */}
          <div className="flex-1 flex flex-col">
            <textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full px-5 py-4 bg-transparent dark:bg-transparent text-sm dark:text-zinc-100 text-zinc-900 resize-none flex-1 overflow-y-auto focus:outline-none transition-all font-mono placeholder:text-zinc-400 dark:placeholder:text-zinc-600 border-0"
              style={{ 
                height: "600px",
                minHeight: "600px",
                maxHeight: "600px"
              }}
              required
              placeholder="粘贴或输入 Markdown 内容..."
            />
          </div>

          {/* 分隔线 */}
          <div className="w-px bg-zinc-200 dark:bg-zinc-800"></div>

          {/* 预览区域 */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={previewRef}
              className="px-5 py-4 bg-zinc-50 dark:bg-zinc-800/30 overflow-y-auto flex-1"
              style={{ 
                height: "600px",
                minHeight: "600px",
                maxHeight: "600px"
              }}
            >
              <PostPreview content={content} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === "edit") {
    return (
      <div className="py-4">
        <textarea
          ref={textareaRef}
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full px-5 py-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-transparent text-sm dark:text-zinc-100 text-zinc-900 resize-none flex-1 overflow-y-auto focus:outline-none focus:ring-0 focus:border-zinc-200 dark:focus:border-zinc-800 transition-all font-mono placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          style={{ 
            minHeight: "600px"
          }}
          required
          placeholder="粘贴或输入 Markdown 内容..."
        />
      </div>
    )
  }

  // preview mode
  return (
    <div className="py-4">
      <div 
        ref={previewRef}
        className="px-5 py-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 overflow-y-auto flex-1"
        style={{ 
          minHeight: "600px"
        }}
      >
        <PostPreview content={content} />
      </div>
    </div>
  )
}
