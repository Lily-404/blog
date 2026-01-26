"use client"

import { ArrowLeft } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import { IconButton } from "@/components/ui/icon-button"
import type { HeaderProps } from "@/types/header"

import { HeaderHome } from "./header-home"

export function Header({ showBackButton = false, backButtonHref = "/", showNav = true, isHome = false, title }: HeaderProps) {
  if (isHome) {
    return <HeaderHome />
  }

  return (
    <header className="flex justify-between items-center mb-6 min-h-[2.5rem]">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {showBackButton && (
          <>
            <IconButton
              icon={ArrowLeft}
              size="md"
              href={backButtonHref}
              iconClassName="w-6 h-6"
              aria-label="返回"
              className="flex-shrink-0"
            />
            {title && (
              <h1 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100 md:hidden truncate">
                {title}
              </h1>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        {showNav && <HeaderNav />}
      </div>
    </header>
  )
}