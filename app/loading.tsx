import { LoadingState } from "@/components/ui/loading-state"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingState label="加载中" variant="Drive" />
    </div>
  )
}
