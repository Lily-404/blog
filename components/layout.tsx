"use client"

import { BackToTop } from "@/components/ui/back-to-top"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  )
} 