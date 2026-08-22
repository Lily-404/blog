"use client"

import Link from "next/link"
import { Archive, User, Pencil } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/notes", label: "随笔", icon: Pencil },
  { href: "/archive", label: "归档", icon: Archive },
  { href: "/about", label: "关于", icon: User },
] as const

export function HeaderNav({ showLinks = true }: { showLinks?: boolean }) {
  const pathname = usePathname()

  return (
    <nav aria-label="站点导航" className="flex items-center gap-1 text-sm">
      {showLinks &&
        NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center justify-center gap-2",
                "min-h-10 min-w-10 px-2 rounded-md",
                "transition-[color,scale] duration-150 ease-out",
                "active:scale-[0.96]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                "focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100",
                active
                  ? "text-zinc-800 dark:text-zinc-200"
                  : "text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
              )}
            >
              <Icon
                className="h-4 w-4 flex-shrink-0"
                strokeWidth={active ? 2 : 1.5}
                aria-hidden
              />
              <span className="hidden md:inline">{label}</span>
            </Link>
          )
        })}
      <ThemeToggle />
    </nav>
  )
}
