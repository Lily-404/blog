import { useEffect } from 'react'

/**
 * 优化 Markdown 渲染后的图片
 * - 添加懒加载
 * - 添加 loading 属性
 * - 添加合适的 sizes 属性
 */
export function useMarkdownImages(options?: {
  enabled?: boolean
  selector?: string
}) {
  const { enabled = true, selector = '.prose img' } = options || {}

  useEffect(() => {
    if (!enabled) return

    const images = document.querySelectorAll<HTMLImageElement>(selector)
    
    images.forEach((img) => {
      // 跳过已经处理过的图片
      if (img.dataset.optimized === 'true') return

      // 添加懒加载
      if (!img.loading) {
        img.loading = 'lazy'
      }

      // 添加 decoding 属性
      if (!img.decoding) {
        img.decoding = 'async'
      }

      // 为响应式图片添加 sizes 属性
      if (!img.sizes) {
        // 根据图片的父容器宽度设置 sizes
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 720px, 672px'
      }

      // 添加过渡效果
      if (!img.style.transition) {
        img.style.transition = 'opacity 0.3s ease-in-out'
      }

      // 图片加载前显示半透明
      if (img.complete) {
        img.style.opacity = '1'
      } else {
        img.style.opacity = '0.5'
        
        const handleLoad = () => {
          img.style.opacity = '1'
          img.dataset.optimized = 'true'
        }

        const handleError = () => {
          img.style.opacity = '1'
          img.dataset.optimized = 'true'
        }

        img.addEventListener('load', handleLoad, { once: true })
        img.addEventListener('error', handleError, { once: true })
      }

      // 标记为已处理
      img.dataset.optimized = 'true'
    })
  }, [enabled, selector])
}
