import { type RefObject, type MouseEvent } from "react"

export interface Use3DEffectOptions {
  /** 旋转强度，值越小旋转越明显，默认 10 */
  intensity?: number
  /** 悬停时的缩放比例，默认 1.1 */
  scale?: number
  /** 透视距离，默认 1000px */
  perspective?: number
}

export interface Use3DEffectReturn {
  /** 鼠标移动事件处理器 */
  onMouseMove: (e: MouseEvent<HTMLElement>) => void
  /** 鼠标离开事件处理器 */
  onMouseLeave: () => void
}

/**
 * 3D 悬停效果 Hook
 * 根据鼠标位置对元素应用 3D 旋转和缩放效果
 * 
 * @param ref - 目标元素的 ref
 * @param options - 配置选项
 * @returns 事件处理器对象
 * 
 * @example
 * ```tsx
 * const imageRef = useRef<HTMLDivElement>(null)
 * const { onMouseMove, onMouseLeave } = use3DEffect(imageRef, { intensity: 8 })
 * 
 * <div
 *   ref={imageRef}
 *   onMouseMove={onMouseMove}
 *   onMouseLeave={onMouseLeave}
 * >
 *   ...
 * </div>
 * ```
 */
export function use3DEffect(
  ref: RefObject<HTMLElement | null>,
  options: Use3DEffectOptions = {}
): Use3DEffectReturn {
  const {
    intensity = 10,
    scale = 1.1,
    perspective = 1000,
  } = options

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / intensity
    const rotateY = (centerX - x) / intensity

    ref.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale(1)`
    }
  }

  return {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}
