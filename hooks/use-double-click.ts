import { useRef, useCallback } from "react"

export interface UseDoubleClickOptions {
  /** 双击时间窗口（毫秒），默认 300 */
  timeout?: number
  /** 单击回调（可选） */
  onSingleClick?: () => void
  /** 双击回调 */
  onDoubleClick: () => void
}

/**
 * 双击检测 Hook
 * 检测元素的单击和双击事件，支持可配置的时间窗口
 * 
 * @param options 配置选项
 * @returns 点击处理函数
 * 
 * @example
 * ```tsx
 * const handleClick = useDoubleClick({
 *   timeout: 300,
 *   onSingleClick: () => console.log('单击'),
 *   onDoubleClick: () => router.push('/admin'),
 * })
 * 
 * return <div onClick={handleClick}>点击我</div>
 * ```
 */
export function useDoubleClick(options: UseDoubleClickOptions) {
  const {
    timeout = 300,
    onSingleClick,
    onDoubleClick,
  } = options

  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef(0)

  const handleClick = useCallback(() => {
    clickCountRef.current += 1

    if (clickCountRef.current === 1) {
      // 第一次点击，设置定时器
      clickTimeoutRef.current = setTimeout(() => {
        // 超时后认为是单击
        if (clickCountRef.current === 1 && onSingleClick) {
          onSingleClick()
        }
        clickCountRef.current = 0
      }, timeout)
    } else if (clickCountRef.current === 2) {
      // 第二次点击，清除定时器并触发双击
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      clickCountRef.current = 0
      onDoubleClick()
    }
  }, [timeout, onSingleClick, onDoubleClick])

  return handleClick
}
