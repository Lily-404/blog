"use client"

import { useRef } from "react"
import { PostPreview } from "@/components/post-preview"
import { Card } from "@/components/ui/card"

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
        <Card variant="default" shadow={false} className="flex flex-col lg:flex-row overflow-hidden p-0">
          {/* 编辑区域 */}
          <div className="flex-1 flex flex-col">
            <textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full px-5 py-4 bg-transparent dark:bg-transparent text-sm dark:text-zinc-100 text-zinc-900 resize-none flex-1 overflow-y-auto focus:outline-none transition-all font-mono placeholder:text-zinc-400 dark:placeholder:text-zinc-600 border-0 h-[300px] lg:h-[600px] min-h-[300px] lg:min-h-[600px] max-h-[300px] lg:max-h-[600px]"
              required
              title=""
              placeholder="粘贴或输入 Markdown 内容..."
            />
          </div>

          {/* 分隔线 - 移动端显示水平线，桌面端显示垂直线 */}
          <div className="h-px lg:h-full lg:w-px bg-zinc-200 dark:bg-zinc-800"></div>

          {/* 预览区域 */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={previewRef}
              className="px-5 py-4 bg-zinc-50 dark:bg-zinc-800/30 overflow-y-auto flex-1 h-[300px] lg:h-[600px] min-h-[300px] lg:min-h-[600px] max-h-[300px] lg:max-h-[600px]"
            >
              <PostPreview content={content} />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (viewMode === "edit") {
    return (
      <div className="py-4">
        <Card variant="default" shadow={false} className="p-0">
          <textarea
            ref={textareaRef}
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full px-5 py-4 bg-transparent dark:bg-transparent text-sm dark:text-zinc-100 text-zinc-900 resize-none flex-1 overflow-y-auto focus:outline-none focus:ring-0 focus:border-zinc-200 dark:focus:border-zinc-800 transition-all font-mono placeholder:text-zinc-400 dark:placeholder:text-zinc-600 border-0"
          style={{ 
            minHeight: "600px"
          }}
          required
          title=""
          placeholder="粘贴或输入 Markdown 内容..."
          />
        </Card>
      </div>
    )
  }

  // preview mode
  return (
    <div className="py-4">
      <Card variant="muted" shadow={false} className="p-0">
        <div
          ref={previewRef}
          className="px-5 py-4 overflow-y-auto flex-1"
          style={{ 
            minHeight: "600px"
          }}
        >
          <PostPreview content={content} />
        </div>
      </Card>
    </div>
  )
}
