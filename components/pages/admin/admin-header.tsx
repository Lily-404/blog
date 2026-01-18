"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type ContentType = "post" | "note"
type ViewMode = "edit" | "preview" | "split"

interface AdminHeaderProps {
  username: string | null
  contentType: ContentType
  viewMode: ViewMode
  onContentTypeChange: (type: ContentType) => void
  onViewModeChange: (mode: ViewMode) => void
  onLogout: () => void
}

export function AdminHeader({
  username,
  contentType,
  viewMode,
  onContentTypeChange,
  onViewModeChange,
  onLogout,
}: AdminHeaderProps) {
  const getGreeting = () => {
    if (!username) return null
    
    const hour = new Date().getHours()
    let greeting = "你好"
    let emoji = "👋"
    if (hour >= 5 && hour < 12) {
      greeting = "早上好"
      emoji = "☀️"
    } else if (hour >= 12 && hour < 18) {
      greeting = "下午好"
      emoji = "🌤️"
    } else if (hour >= 18 && hour < 22) {
      greeting = "晚上好"
      emoji = "🌃"
    } else {
      greeting = "夜深了"
      emoji = "🌙"
    }
    
    return { greeting, emoji }
  }

  const greeting = getGreeting()

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        {username && greeting && (
          <>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {greeting.greeting}，{username}！{greeting.emoji}
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2">
              {contentType === "note" ? "记录这一刻的想法" : "今天想写点什么？"}
            </p>
          </>
        )}
        {!username && (
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">内容管理</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* 类型切换和视图模式 - 统一放在右上角 */}
        <div className="flex items-center gap-2">
          {/* 视图模式切换 - 仅在文章模式下显示，放在左边 */}
          {contentType === "post" && (
            <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onViewModeChange("edit")}
                className={cn(
                  "h-8 px-3 rounded-md text-xs font-medium transition-all",
                  viewMode === "edit"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-white dark:hover:bg-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                编辑
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onViewModeChange("split")}
                className={cn(
                  "h-8 px-3 rounded-md text-xs font-medium transition-all",
                  viewMode === "split"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-white dark:hover:bg-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                分栏
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onViewModeChange("preview")}
                className={cn(
                  "h-8 px-3 rounded-md text-xs font-medium transition-all",
                  viewMode === "preview"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-white dark:hover:bg-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                预览
              </Button>
            </div>
          )}
          
          {/* 类型切换 - 放在右边 */}
          <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onContentTypeChange("post")}
              className={cn(
                "h-8 px-3 rounded-md text-xs font-medium transition-all",
                contentType === "post"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-stone-50 dark:hover:bg-zinc-700"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              文章
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onContentTypeChange("note")}
              className={cn(
                "h-8 px-3 rounded-md text-xs font-medium transition-all",
                contentType === "note"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-stone-50 dark:hover:bg-zinc-700"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              随笔
            </Button>
          </div>
          
          {/* 帮助按钮 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-10 w-10 p-0 rounded-md",
                  "bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                  "border border-zinc-200/60 dark:border-zinc-700/60",
                  "shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_2px_0_rgb(0,0,0,0.2)]",
                  "text-zinc-500 dark:text-zinc-300",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300/60 dark:hover:border-zinc-600/60",
                  "hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.08)] dark:hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.25)]",
                  "hover:text-zinc-700 dark:hover:text-zinc-200"
                )}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-4 bg-stone-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg"
              align="end"
            >
              <h3 className="font-semibold mb-3 text-zinc-800 dark:text-zinc-200 text-sm">使用说明</h3>
              <ul className="list-disc list-inside space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {contentType === "post" ? (
                  <>
                    <li>博客文章需要标题、日期和内容，可选标签</li>
                    <li>支持完整的 Markdown 语法，包括代码块、数学公式、表格等</li>
                    <li>内容提交后会通过 GitHub API 创建文件</li>
                    <li>Vercel 会自动检测 GitHub 变更并重新部署</li>
                    <li>通常需要 1-2 分钟才能在网站上看到新文章</li>
                    <li>文件 ID 会自动生成</li>
                  </>
                ) : (
                  <>
                    <li>随笔只需要日期和内容，更简洁随意</li>
                    <li>建议使用简单文本，Markdown 语法可选但不推荐复杂结构</li>
                    <li>内容提交后会通过 GitHub API 创建文件</li>
                    <li>Vercel 会自动检测 GitHub 变更并重新部署</li>
                    <li>通常需要 1-2 分钟才能在网站上看到新随笔</li>
                  </>
                )}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* 登出按钮 */}
        <Button 
          onClick={onLogout} 
          variant="outline" 
          className={cn(
            "h-10 px-3 rounded-md text-xs font-medium",
            "bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm",
            "border border-zinc-200/60 dark:border-zinc-700/60",
            "shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_2px_0_rgb(0,0,0,0.2)]",
            "text-zinc-700 dark:text-zinc-300",
            "hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300/60 dark:hover:border-zinc-600/60",
            "hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.08)] dark:hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.25)]"
          )}
        >
          登出
        </Button>
      </div>
    </div>
  )
}
