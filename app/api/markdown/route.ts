import { NextResponse } from "next/server"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      )
    }

    const processed = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content)

    let htmlContent = processed.toString()

    // 处理数学公式（在客户端处理会更灵活，但这里先简单处理）
    // 块级公式 $$...$$
    htmlContent = htmlContent.replace(
      /\$\$([\s\S]+?)\$\$/g,
      '<div class="katex-block my-4">$$$1$$</div>'
    )

    // 行内公式 $...$
    htmlContent = htmlContent.replace(
      /\$([^\$]+?)\$/g,
      '<span class="katex-inline">$$$1$</span>'
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
