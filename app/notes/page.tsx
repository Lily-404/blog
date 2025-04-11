import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeaderNav } from "@/components/header-nav"
import { Layout } from "@/components/layout"
import { NotesPagination } from "@/components/notes-pagination"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

// 设置为完全静态生成
export const dynamic = 'force-static'
export const revalidate = false // 禁用重新验证，因为数据是静态的

// 预生成首页数据
export async function generateStaticParams() {
  return [{}] // 只需要生成一个首页
}

export default async function NotesPage() {
  const { notes, total } = await getPaginatedNotesAction(1, 15)

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header showBackButton={true} title="随笔" />

        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <div>
            <img
              src="/cat.jpg"
              alt="Jimmy's avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-base font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Jimmy</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">记录想法和感受</p>
          </div>
        </div>

        <main>
          <NotesPagination 
            initialNotes={notes}
            initialTotal={total}
          />
        </main>

        <Footer />
      </div>
    </Layout>
  )
}