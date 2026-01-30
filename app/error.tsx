'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          出了点问题
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : '页面加载时发生错误，请稍后重试。'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            重试
          </button>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
