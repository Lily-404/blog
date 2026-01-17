import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期为中文格式
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return "日期无效"
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}年${month}月${day}日`
}

// 延迟函数
export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 预加载图片
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve()
    img.onerror = reject
  })
}

// 预加载链接
export function preloadLink(href: string): void {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}
