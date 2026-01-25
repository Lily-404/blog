import { Layout } from "@/components/layout"
import { NotesPagination } from "@/components/notes-pagination"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/header"
// 移除未使用的导入

// 设置为完全静态生成
export const dynamic = 'force-static'
export const revalidate = false // 禁用重新验证，因为数据是静态的

// 预生成首页数据，并指定生成的页数
export async function generateStaticParams() {
  const { totalPages } = await getPaginatedNotesAction(1, 7)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString()
  }))
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: { page?: string }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const { notes, total, totalPages } = await getPaginatedNotesAction(currentPage, 7)

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header showBackButton={true} title="随笔" />

        <main>
          <NotesPagination 
            initialNotes={notes}
            initialTotal={total}
            initialPage={currentPage}
            totalPages={totalPages}
          />
        </main>

        <Footer />
      </div>
    </Layout>
  )
}