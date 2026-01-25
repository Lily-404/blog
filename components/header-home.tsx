"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { useDoubleClick } from "@/hooks/use-double-click"

export function HeaderHome() {
  const router = useRouter()
  
  const handleAvatarClick = useDoubleClick({
    timeout: 300,
    onDoubleClick: () => router.push("/admin"),
  })

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
