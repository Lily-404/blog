import { Layout } from "@/components/layout"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminLoading() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header showBackButton={true} />
        <LoadingSpinner
          message="正在验证身份..."
          subMessage="稍等片刻"
          size="lg"
          fullPage={true}
        />
      </div>
    </Layout>
  )
}
