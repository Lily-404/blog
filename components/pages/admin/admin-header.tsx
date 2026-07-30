"use client"

import { useMemo } from "react"

type ContentType = "post" | "note"
type ViewMode = "edit" | "preview" | "split"

interface AdminHeaderProps {
  username: string | null
  contentType: ContentType
  viewMode: ViewMode
  showList: boolean
  onContentTypeChange: (type: ContentType) => void
  onViewModeChange: (mode: ViewMode) => void
  onLogout: () => void
  onToggleList: () => void
}

export function AdminHeader({
  username,
  contentType,
  viewMode,
  showList,
  onContentTypeChange,
  onViewModeChange,
  onLogout,
  onToggleList,
}: AdminHeaderProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "早上好"
    if (hour >= 12 && hour < 18) return "下午好"
    if (hour >= 18 && hour < 22) return "晚上好"
    return "夜深了"
  }, [])

  return (
    <div className="mb-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <p className="nd-label mb-1">
            {greeting}
            {username ? ` / ${username}` : ""}
          </p>
          <h1 className="text-[22px] md:text-[24px] font-medium tracking-tight text-[var(--nd-text-display)] leading-tight">
            {username ? `${username}` : "内容管理"}
          </h1>
          <p className="mt-1 text-[13px] text-[var(--nd-text-secondary)]">
            {contentType === "note" ? "记录这一刻的想法" : "今天想写点什么？"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {contentType === "post" && !showList && (
            <div className="nd-segment">
              {(["edit", "split", "preview"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onViewModeChange(mode)}
                  className="nd-segment-item !min-h-[32px] !px-3 !py-1.5"
                  data-active={viewMode === mode}
                >
                  {mode === "edit" ? "编辑" : mode === "split" ? "分栏" : "预览"}
                </button>
              ))}
            </div>
          )}

          <div className="nd-segment">
            {(["post", "note"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onContentTypeChange(type)}
                className="nd-segment-item !min-h-[32px] !px-3 !py-1.5"
                data-active={contentType === type}
              >
                {type === "post" ? "文章" : "随笔"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleList}
            className="nd-btn nd-btn-secondary !min-h-[32px] !px-3 !py-1.5 !text-[11px]"
          >
            {showList ? "写作" : "列表"}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="nd-btn nd-btn-ghost !min-h-[32px] !px-2 !text-[11px]"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  )
}
