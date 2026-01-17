import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import type { HeaderProps } from "@/types/header"


import { HeaderHome } from "./header-home"

export function Header({ showBackButton = false, backButtonHref = "/", showNav = true, isHome = false, title }: HeaderProps) {
  if (isHome) {
    return <HeaderHome />
  }

  return (
    <header className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <>
            <Link 
              href={backButtonHref} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-200 ease-out hover:scale-110 active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            {title && (
              <h1 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100 md:hidden">
                {title}
              </h1>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {showNav && <HeaderNav />}
      </div>
    </header>
  )
}