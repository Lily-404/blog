"use client"

import { Layout } from "@/components/layout"
import { Header } from "@/components/header"

export function AdminLoadingView() {
  return (
    <Layout>
      <div className="nd-admin">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Header showBackButton={true} />
          <div className="flex flex-col items-center justify-center py-24 nd-dot-grid rounded-2xl">
            <p className="nd-status">[LOADING]</p>
            <p className="nd-label mt-4">AUTH CHECK</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
