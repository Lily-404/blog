import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { LoadingState } from "@/components/ui/loading-state"

export default function AdminLoading() {
  return (
    <Layout>
      <div className="nd">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Header showBackButton={true} showNavLinks={false} />
          <div className="flex flex-col items-center justify-center py-24">
            <LoadingState label="正在验证身份" variant="Drive" />
          </div>
        </div>
      </div>
    </Layout>
  )
}
