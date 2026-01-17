"use client"

import Link from "next/link"
import { HeaderNav } from "@/components/header-nav"

export function HeaderHome() {
  return (
    <header className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <img
            src="/cat.jpg"
            alt="Jimmy's avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
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
