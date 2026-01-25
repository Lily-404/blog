"use client"

import { ArrowUp } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { useScrollDetection } from "@/hooks/use-scroll-detection"

export function BackToTop() {
  const { isScrolled } = useScrollDetection({ threshold: 100 })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isScrolled) return null

  return (
    <IconButton
      icon={ArrowUp}
      size="md"
      onClick={scrollToTop}
      iconClassName="w-6 h-6"
      className="fixed bottom-7 right-7"
      aria-label="返回顶部"
    />
  )
}
