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
      <p className="nd-label mb-4">RESTRICTED</p>
      <h1 className="nd-display text-[48px] md:text-[64px] mb-4">ACCESS</h1>
      <p className="text-[16px] leading-relaxed text-[var(--nd-text-primary)] mb-2">
        内容管理入口。仅仓库所有者或协作者可进入。
      </p>
      <p className="nd-caption mb-10">
        AUTHENTICATE VIA GITHUB TO CONTINUE
      </p>

      {error && (
        <p className="nd-status mb-4" data-tone="error">
          [ERROR] {error}
        </p>
      )}
      {success && (
        <p className="nd-status mb-4" data-tone="success">
          [OK] {success}
        </p>
      )}

      <button
        type="button"
        onClick={onGitHubLogin}
        disabled={loading}
        className="nd-btn nd-btn-primary w-full"
      >
        {loading ? "[LOADING]" : "GITHUB LOGIN"}
      </button>

      <p className="nd-caption mt-8 text-center">
        OWNER / COLLABORATOR ONLY
      </p>
    </div>
  )
}
