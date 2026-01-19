"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import { HeaderNav } from "@/components/header-nav"
import { OptimizedImage } from "@/components/ui/optimized-image"

export function HeaderHome() {
  const router = useRouter()
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef(0)

  const handleAvatarClick = () => {
    clickCountRef.current += 1

    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0
      }, 300) 
    } else if (clickCountRef.current === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      clickCountRef.current = 0
      router.push("/admin")
    }
  }

  return (
    <header className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div onClick={handleAvatarClick}>
          <OptimizedImage
            src="/cat.jpg"
            alt="Jimmy's avatar"
            width={40}
            height={40}
            priority
            className="w-10 h-10 rounded-full object-cover cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95"
          />
        </div>
        <h1 
          className="text-xl font-medium tracking-tight transition-colors cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
          }}
        >
          Jimmy's Blog
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <HeaderNav />
      </div>
    </header>
  )
}
