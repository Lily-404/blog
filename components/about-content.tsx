"use client"

import { useRef } from "react"
import { Github, Globe, Mail, Rss, MessageCircle, User } from "lucide-react"
import { Footer } from "@/components/ui/footer"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Header } from "@/components/header"
import { ActionButton } from "@/components/ui/action-button"
import { CopyButton } from "@/components/ui/copy-button"
import { StatCard } from "@/components/ui/stat-card"
import { Card } from "@/components/ui/card"
import { use3DEffect } from "@/hooks/use-3d-effect"
import { friends } from "@/lib/friends"

type AboutContentProps = {
  initialStats: {
    posts: number
    notes: number
    tags: number
  }
}

export function AboutContent({ initialStats }: AboutContentProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const { onMouseMove, onMouseLeave } = use3DEffect(imageRef, { intensity: 8 })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header showBackButton={true} title="关于" />

      <main>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div
            ref={imageRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="w-32 h-32 md:w-48 md:h-48 relative rounded-xl overflow-hidden
              ring-2 ring-zinc-100/50 dark:ring-zinc-800/50
              border border-zinc-200/50 dark:border-zinc-700/50
              hover:border-zinc-300/50 dark:hover:border-zinc-600/50
              transition-all duration-300 ease-out
              group shrink-0"
          >
            <OptimizedImage
              src="/logo2.png"
              alt="Jimmy's photo"
              width={192}
              height={192}
              className="object-cover transition-all duration-300 ease-out dark:invert"
              priority
              sizes="(max-width: 768px) 128px, 192px"
              quality={75}
            />
          </div>
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-3xl font-bold mb-2">关于</h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                O Captain! My Captain!
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <ActionButton
                icon={User}
                href="https://about.jimmy-blog.top/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                作品集
              </ActionButton>
              <ActionButton
                icon={Github}
                href="https://github.com/Lily-404"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </ActionButton>
              <ActionButton
                leading="J"
                href="https://okjk.co/ITgDUG"
                target="_blank"
                rel="noopener noreferrer"
              >
                即刻
              </ActionButton>
              <CopyButton icon={Mail} value="sxy1308075897@gmail.com">
                邮箱
              </CopyButton>
              <CopyButton icon={MessageCircle} value="OOIll0">
                微信
              </CopyButton>
              <ActionButton
                icon={Rss}
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
              >
                RSS
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card variant="muted" size="lg" rounded="2xl">
            <h2 className="text-xl font-semibold mb-4">简介</h2>
            <div className="space-y-4">
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                在这里记录生活的点点滴滴，分享一些有趣的想法和感受
              </p>
              <div className="grid grid-cols-3 gap-4">
                <StatCard
                  value={initialStats.posts}
                  label="文章"
                  layout="horizontal"
                  valueSize="md"
                  wrapped
                />
                <StatCard
                  value={initialStats.notes}
                  label="随笔"
                  layout="horizontal"
                  valueSize="md"
                  wrapped
                />
                <StatCard
                  value={initialStats.tags}
                  label="标签"
                  layout="horizontal"
                  valueSize="md"
                  wrapped
                />
              </div>
            </div>
          </Card>

          <Card variant="muted" size="lg">
            <h2 className="text-xl font-semibold mb-4">项目</h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <p>本博客是一个开源项目，感兴趣的话麻烦点个 Star：</p>
              <a
                href="https://github.com/Lily-404/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2
                  text-zinc-600 dark:text-zinc-400
                  hover:text-zinc-800 dark:hover:text-zinc-200
                  transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>Lily-404/blog</span>
              </a>
            </div>
          </Card>

          <Card variant="muted" size="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">友链</h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                共 {friends.length} 个
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {friends.map((friend) => (
                <a
                  key={friend.url}
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-3 rounded-xl
                    hover:bg-zinc-100/70 dark:hover:bg-zinc-700/40
                    transition-colors"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-200/60 dark:bg-zinc-700/60 shrink-0">
                    {friend.avatar ? (
                      <OptimizedImage
                        src={friend.avatar}
                        alt={friend.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate
                      group-hover:text-zinc-950 dark:group-hover:text-white transition-colors"
                    >
                      {friend.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                      {friend.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}