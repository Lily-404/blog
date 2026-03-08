"use client"

import { ActionButton } from "@/components/ui/action-button"
import { Alert } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Github, Loader2 } from "lucide-react"

interface AdminUnauthenticatedViewProps {
  error: string
  success: string
  loading: boolean
  onGitHubLogin: () => void
}

export function AdminUnauthenticatedView({
  error,
  success,
  loading,
  onGitHubLogin,
}: AdminUnauthenticatedViewProps) {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">你居然发现这里了！🎉</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
        这里是我的秘密基地，只有我知道怎么进来 😎
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-6 italic">
        不过既然你找到了，那就用 GitHub 登录试试看吧～
      </p>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}
      <ActionButton
        icon={loading ? Loader2 : Github}
        iconClassName={loading ? "animate-spin" : undefined}
        onClick={onGitHubLogin}
        disabled={loading}
        className="w-full justify-center"
      >
        {loading ? "登录中..." : "用 GitHub 登录试试"}
      </ActionButton>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        提示：只有仓库所有者或协作者才能进来哦
      </p>

      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 italic">
            "好奇心是发现秘密的第一步"
          </p>
          <div className="flex justify-center gap-2 text-2xl mt-6">
            <span>🎨</span>
            <span>💻</span>
            <span>📝</span>
            <span>✨</span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-4">
            如果你真的进来了，记得帮我写点好东西 😊
          </p>
          <Card variant="muted" size="md">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-semibold">小贴士：</span>
              <br />
              这个页面是我用来管理博客内容的，如果你也想搭建类似的博客，可以看看我的 GitHub 仓库源码哦～
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

