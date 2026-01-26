"use client"

import { useRef } from "react"
import { PostPreview } from "@/components/post-preview"
import { Card } from "@/components/ui/card"
import { MarkdownTextarea } from "@/components/ui/markdown-textarea"
import { SplitDivider } from "@/components/ui/split-divider"
import { EditorPane } from "@/components/ui/editor-pane"
import { PreviewPane } from "@/components/ui/preview-pane"
import { EditorWrapper } from "@/components/ui/editor-wrapper"

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
      <EditorWrapper>
        <Card variant="default" shadow={false} className="flex flex-col lg:flex-row overflow-hidden p-0 max-w-full">
          <EditorPane splitMode>
            <MarkdownTextarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              splitMode
              required
            />
          </EditorPane>

          <SplitDivider />

          <PreviewPane ref={previewRef} splitMode>
            <PostPreview content={content} />
          </PreviewPane>
        </Card>
      </EditorWrapper>
    )
  }

  if (viewMode === "edit") {
    return (
      <EditorWrapper>
        <Card variant="default" shadow={false} className="p-0 max-w-full overflow-hidden">
          <MarkdownTextarea
            ref={textareaRef}
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            required
          />
        </Card>
      </EditorWrapper>
    )
  }

  // preview mode
  return (
    <EditorWrapper>
      <Card variant="muted" shadow={false} className="p-0 max-w-full overflow-hidden">
        <PreviewPane ref={previewRef} variant="muted">
          <PostPreview content={content} />
        </PreviewPane>
      </Card>
    </EditorWrapper>
  )
}
