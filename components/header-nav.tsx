"use client"

import Link from "next/link"
import { Archive, User, Pencil } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function HeaderNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path
  const linkClasses = (path: string) => {
    const active = isActive(path)
    return `flex items-center ${
      active 
        ? 'text-zinc-800 dark:text-zinc-300' 
        : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300'
    }`
  }

  const iconClasses = (path: string) => {
    const active = isActive(path)
    return `h-4 w-4 mr-2 ${
      active 
        ? 'text-zinc-800 dark:text-zinc-300' 
        : 'text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-300'
    }`
  }

  return (
    <nav className="flex items-center space-x-4 text-sm">
      <Link 
        href="/notes" 
        className={linkClasses('/notes')}
      >
        <Pencil className={iconClasses('/notes')} />
        <span className="hidden md:inline">随笔</span>
      </Link>
      <Link 
        href="/archive" 
        className={linkClasses('/archive')}
      >
        <Archive className={iconClasses('/archive')} />
        <span className="hidden md:inline">归档</span>
      </Link>
      <Link 
        href="/about" 
        className={linkClasses('/about')}
      >
        <User className={iconClasses('/about')} />
        <span className="hidden md:inline">关于</span>
      </Link>
      <ThemeToggle />
    </nav>
  )
}