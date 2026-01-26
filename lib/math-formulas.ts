import katex from "katex"
import "katex/dist/katex.min.css"

/**
 * 处理 Markdown 内容中的数学公式
 * 支持行内公式 $...$ 和块级公式 $$...$$
 * 
 * @param content - 原始 Markdown 内容
 * @param options - 配置选项
 * @returns 处理后的 HTML 字符串
 * 
 * @example
 * ```ts
 * const html = processMathFormulas("这是行内公式 $x^2$ 和块级公式 $$\\int_0^1 x dx$$")
 * ```
 */
export function processMathFormulas(
  content: string,
  options: {
    /** 块级公式的 CSS 类名 */
    blockFormulaClass?: string
    /** 行内公式的 CSS 类名 */
    inlineFormulaClass?: string
    /** 是否在出错时抛出异常，默认 false */
    throwOnError?: boolean
  } = {}
): string {
  const {
    blockFormulaClass = "katex-block",
    inlineFormulaClass = "katex-inline",
    throwOnError = false,
  } = options

  const renderMath = (tex: string, displayMode: boolean) => {
    try {
      return katex.renderToString(tex.trim(), {
        displayMode,
        throwOnError,
      })
    } catch (e) {
      console.error("KaTeX error:", e)
      return tex
    }
  }

  // 处理块级公式 $$...$$
  let result = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    return `<div class="${blockFormulaClass}">${renderMath(tex, true)}</div>`
  })

  // 处理行内公式 $...$
  result = result.replace(/\$([^\$]+?)\$/g, (_, tex) => {
    return `<span class="${inlineFormulaClass}">${renderMath(tex, false)}</span>`
  })

  return result
}
