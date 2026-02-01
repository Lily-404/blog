import { useEffect } from "react"

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
const SUCCESS_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

const BTN_BASE_CLASS =
  "p-1.5 rounded-full bg-white/85 dark:bg-zinc-800/90 backdrop-blur-sm border border-zinc-200/90 dark:border-zinc-600/80 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 dark:hover:text-zinc-50 dark:hover:border-zinc-500/80 transition-[background-color,border-color,color] duration-200 ease-out shadow-sm [transform:translateZ(0)] [will-change:backdrop-filter]"

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
    selector = "pre",
    successDuration = 2000,
    enabled = true,
  } = options

  useEffect(() => {
    if (!enabled) return

    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const codeBlocks = document.querySelectorAll(selector)

    codeBlocks.forEach((pre) => {
      if (pre.closest(".code-block-copy-wrapper")) return

      const wrapper = document.createElement("div")
      wrapper.className = "code-block-copy-wrapper relative group"

      const buttonContainer = document.createElement("div")
      buttonContainer.className =
        "code-block-copy-btn-wrap absolute right-4 top-4 z-10 flex items-center opacity-0 group-hover:opacity-100 [transform:translateZ(0)]"

      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = BTN_BASE_CLASS
      btn.innerHTML = COPY_ICON
      btn.setAttribute("aria-label", "复制代码")

      btn.addEventListener("click", async () => {
        if (btn.getAttribute("aria-label") === "已复制") return

        const code = pre.querySelector("code")?.textContent ?? ""
        try {
          await navigator.clipboard.writeText(code)
          btn.innerHTML = SUCCESS_ICON
          btn.setAttribute("aria-label", "已复制")

          const id = setTimeout(() => {
            btn.innerHTML = COPY_ICON
            btn.setAttribute("aria-label", "复制代码")
            timeouts.delete(id)
          }, successDuration)
          timeouts.add(id)
        } catch (err) {
          console.error("Failed to copy code:", err)
        }
      })

      buttonContainer.appendChild(btn)
      pre.classList.add("pt-12")
      pre.parentElement?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(buttonContainer)
    })

    return () => {
      timeouts.forEach(clearTimeout)
      timeouts.clear()
      document.querySelectorAll(".code-block-copy-wrapper").forEach((wrapper) => {
        const pre = wrapper.firstElementChild
        if (pre?.tagName === "PRE") {
          pre.classList.remove("pt-12")
          wrapper.parentElement?.insertBefore(pre, wrapper)
        }
        wrapper.remove()
      })
    }
  }, [selector, successDuration, enabled])
}
