import { Suspense } from "react"
import { ArchiveContent } from "@/components/archive-content"

export function generateStaticParams() {
  return []
}

export const revalidate = 3600 // 1小时缓存

export default function Archive() {
  return (
    <Suspense>
      <ArchiveContent />
    </Suspense>
  )
}

