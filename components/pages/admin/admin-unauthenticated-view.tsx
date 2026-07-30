"use client"

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
    <div className="max-w-md mx-auto mt-16 mb-24">
      <p className="nd-label mb-4">受限区域</p>
      <h1 className="nd-display text-[48px] md:text-[64px] mb-4">你好</h1>
      <p className="text-[16px] leading-relaxed text-[var(--nd-text-primary)] mb-2">
        这里是内容管理入口，只有仓库所有者或协作者可以进入。
      </p>
      <p className="nd-caption mb-10">
        使用 GitHub 登录以继续
      </p>

      {error && (
        <p className="nd-status mb-4" data-tone="error">
          [错误] {error}
        </p>
      )}
      {success && (
        <p className="nd-status mb-4" data-tone="success">
          [成功] {success}
        </p>
      )}

      <button
        type="button"
        onClick={onGitHubLogin}
        disabled={loading}
        className="nd-btn nd-btn-primary w-full"
      >
        {loading ? "登录中..." : "用 GitHub 登录"}
      </button>

      <p className="nd-caption mt-8 text-center">
        仅所有者 / 协作者可进入
      </p>
    </div>
  )
}
