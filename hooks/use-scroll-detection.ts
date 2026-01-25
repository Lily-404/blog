import { useEffect, useState } from "react"

export interface UseScrollDetectionOptions {
  /** 滚动阈值（像素），默认 100 */
  threshold?: number
  /** 是否启用，默认 true */
  enabled?: boolean
}

export interface UseScrollDetectionReturn {
  /** 是否已滚动超过阈值 */
  isScrolled: boolean
  /** 当前滚动位置 */
  scrollY: number
}

/**
 * 滚动检测 Hook
 * 检测页面滚动位置是否超过指定阈值
 * 
 * @param options 配置选项
 * @returns 滚动状态
 * 
 * @example
 * ```tsx
 * const { isScrolled, scrollY } = useScrollDetection({
 *   threshold: 100,
 *   enabled: true,
 * })
 * 
 * return isScrolled ? <BackToTopButton /> : null
 * ```
 */
export function useScrollDetection(
  options: UseScrollDetectionOptions = {}
): UseScrollDetectionReturn {
  const {
    threshold = 100,
    enabled = true,
  } = options

  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > threshold)
    }

    // 初始化状态
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, enabled])

  return {
    isScrolled,
    scrollY,
  }
}
