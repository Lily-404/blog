import { useEffect } from "react"

export interface UseCodeBlockCopyOptions {
  /** 代码块选择器，默认 'pre' */
  selector?: string
  /** 成功提示显示时长（毫秒），默认 2000 */
  successDuration?: number
  /** 是否启用，默认 true */
  enabled?: boolean
}

/**
 * 代码块复制功能 Hook
 * 自动为页面中的所有代码块添加复制按钮
 * 
 * @param options 配置选项
 * @returns 清理函数（通常不需要手动调用，useEffect 会自动处理）
 * 
 * @example
 * ```tsx
 * useCodeBlockCopy({
 *   selector: 'pre',
 *   successDuration: 2000,
 *   enabled: true,
 * })
 * ```
 */
export function useCodeBlockCopy(options: UseCodeBlockCopyOptions = {}) {
  const {
    selector = 'pre',
    successDuration = 2000,
    enabled = true,
  } = options

  useEffect(() => {
    if (!enabled) return

    // 为所有代码块添加复制按钮
    const codeBlocks = document.querySelectorAll(selector)

    codeBlocks.forEach((pre) => {
      // 检查是否已经添加过按钮（避免重复添加）
      if (pre.parentElement?.classList.contains("relative")) {
        return
      }

      // 创建外层容器
      const wrapper = document.createElement('div')
      wrapper.className = 'relative mb-6 group'

      // 创建复制按钮容器
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'absolute right-3 top-3 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200'

      // 创建复制按钮
      const copyButton = document.createElement('button')
      copyButton.className = 'p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100'
      copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
      copyButton.setAttribute('aria-label', '复制代码')

      // 创建成功提示按钮
      const successButton = document.createElement('button')
      successButton.className = 'p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100 hidden'
      successButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      successButton.setAttribute('aria-label', '已复制')

      // 添加点击事件
      copyButton.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || ''
        try {
          await navigator.clipboard.writeText(code)

          // 立即更新UI状态
          copyButton.style.display = 'none'
          successButton.style.display = 'block'

          // 指定时长后恢复原始状态
          setTimeout(() => {
            copyButton.style.display = 'block'
            successButton.style.display = 'none'
          }, successDuration)
        } catch (err) {
          console.error('Failed to copy code:', err)
        }
      })

      // 添加元素到容器
      buttonContainer.appendChild(copyButton)
      buttonContainer.appendChild(successButton)

      // 将代码块包装在外层容器中
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(buttonContainer)
    })

    // 清理函数
    return () => {
      const wrappers = document.querySelectorAll('div.relative.mb-6.group')
      wrappers.forEach(wrapper => {
        const pre = wrapper.querySelector(selector)
        if (pre) {
          wrapper.parentNode?.insertBefore(pre, wrapper)
        }
        wrapper.remove()
      })
    }
  }, [selector, successDuration, enabled])
}
