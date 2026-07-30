import { useEffect } from "react"

const COPY_ICON =
  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const SUCCESS_ICON =
  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'

const LANG_LABELS: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  py: "Python",
  python: "Python",
  rb: "Ruby",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  cs: "C#",
  php: "PHP",
  ruby: "Ruby",
  shell: "Shell",
  bash: "Bash",
  sh: "Shell",
  zsh: "Zsh",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sql: "SQL",
  md: "Markdown",
  markdown: "Markdown",
  text: "Text",
  plaintext: "Text",
}

function getLanguageLabel(pre: Element): string {
  const code = pre.querySelector("code")
  const cls = code?.className ?? pre.className ?? ""
  const match = cls.match(/language-([\w+#]+)/i)
  if (!match) return "Code"
  const key = match[1].toLowerCase()
  return LANG_LABELS[key] ?? match[1]
}

export interface UseCodeBlockCopyOptions {
  /** 代码块选择器，默认 'pre' */
  selector?: string
  /** 成功提示显示时长（毫秒），默认 1500 */
  successDuration?: number
  /** 是否启用，默认 true */
  enabled?: boolean
}

/**
 * 为页面中的 markdown 代码块加上卡片头栏与复制按钮
 */
export function useCodeBlockCopy(options: UseCodeBlockCopyOptions = {}) {
  const {
    selector = "pre",
    successDuration = 1500,
    enabled = true,
  } = options

  useEffect(() => {
    if (!enabled) return

    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const codeBlocks = document.querySelectorAll(selector)

    codeBlocks.forEach((pre) => {
      if (pre.closest(".md-code-block")) return

      const wrapper = document.createElement("div")
      wrapper.className = "md-code-block"

      const header = document.createElement("div")
      header.className = "md-code-header"

      const meta = document.createElement("span")
      meta.className = "md-code-meta"
      const lang = document.createElement("span")
      lang.className = "md-code-lang"
      lang.textContent = getLanguageLabel(pre)
      meta.appendChild(lang)

      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "md-code-copy"
      btn.setAttribute("aria-label", "复制代码")
      btn.innerHTML = `${COPY_ICON}<span>复制</span>`

      btn.addEventListener("click", async () => {
        if (btn.dataset.copied === "true") return

        const code = pre.querySelector("code")?.textContent ?? ""
        try {
          await navigator.clipboard.writeText(code)
          btn.dataset.copied = "true"
          btn.classList.add("is-copied")
          btn.innerHTML = `${SUCCESS_ICON}<span>已复制</span>`
          btn.setAttribute("aria-label", "已复制")

          const id = setTimeout(() => {
            btn.dataset.copied = "false"
            btn.classList.remove("is-copied")
            btn.innerHTML = `${COPY_ICON}<span>复制</span>`
            btn.setAttribute("aria-label", "复制代码")
            timeouts.delete(id)
          }, successDuration)
          timeouts.add(id)
        } catch (err) {
          console.error("Failed to copy code:", err)
        }
      })

      header.appendChild(meta)
      header.appendChild(btn)

      pre.parentElement?.insertBefore(wrapper, pre)
      wrapper.appendChild(header)
      wrapper.appendChild(pre)
    })

    return () => {
      timeouts.forEach(clearTimeout)
      timeouts.clear()
      document.querySelectorAll(".md-code-block").forEach((wrapper) => {
        const pre = wrapper.querySelector("pre")
        if (pre) {
          wrapper.parentElement?.insertBefore(pre, wrapper)
        }
        wrapper.remove()
      })
    }
  }, [selector, successDuration, enabled])
}
