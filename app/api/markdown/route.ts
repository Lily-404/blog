import { NextResponse } from "next/server"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"
import { withProtectedCodeSegments } from "@/lib/protect-code-segments"

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      )
    }

    // 去掉内容开头的换行符，实现所见即所得
    const trimmedContent = content.trimStart()

    const processed = await remark()
      .use(remarkGfm)
      .use(html)
      .process(trimmedContent)

    // 跳过 <pre>/<code>，避免 $HOME 等 shell 变量被当成公式定界符
    const htmlContent = withProtectedCodeSegments(
      processed.toString(),
      (protectedHtml) => {
        let result = protectedHtml.replace(
          /\$\$([\s\S]+?)\$\$/g,
          '<div class="katex-block my-4">$$$1$$</div>'
        )

        result = result.replace(
          /\$([^$<]+?)\$/g,
          '<span class="katex-inline">$$$1$</span>'
        )

        return result
      }
    )

    return NextResponse.json({ html: htmlContent })
  } catch (error) {
    console.error("Markdown 处理错误:", error)
    return NextResponse.json(
      { error: "处理失败" },
      { status: 500 }
    )
  }
}
