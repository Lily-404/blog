"use client"

import { useRef, useState } from "react"
import { Github, Mail, Rss, MessageCircle, User } from "lucide-react"
import { Footer } from "@/components/ui/footer"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Header } from "@/components/header"
import { ActionButton } from "@/components/ui/action-button"
import { CopyButton } from "@/components/ui/copy-button"
import { StatCard } from "@/components/ui/stat-card"
import { Card } from "@/components/ui/card"
import { use3DEffect } from "@/hooks/use-3d-effect"

type Post = {
  id: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  category?: string
  content: string
}

type AboutContentProps = {
  initialStats: {
    posts: number;
    notes: number;
    tags: number;
  };
}

export function AboutContent({ initialStats }: AboutContentProps) {
  const [stats, setStats] = useState(initialStats)
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
              <p className="text-lg text-zinc-600 dark:text-zinc-400">O Captain! My Captain!</p>
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
              <CopyButton
                icon={Mail}
                value="sxy1308075897@gmail.com"
              >
                邮箱
              </CopyButton>
              <CopyButton
                icon={MessageCircle}
                value="OOIll0"
              >
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
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-purple-50/10 to-pink-50/10 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5 blur-3xl" />
            <Card variant="muted" size="lg" rounded="2xl" className="relative">
              <h2 className="text-xl font-semibold mb-4">简介</h2>
              <div className="space-y-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">在这里记录生活的点点滴滴，分享一些有趣的想法和感受</p>
                <div className="grid grid-cols-3 gap-4">
                  <StatCard
                    value={stats.posts}
                    label="文章"
                    layout="horizontal"
                    valueSize="md"
                    wrapped
                  />
                  <StatCard
                    value={stats.notes}
                    label="随笔"
                    layout="horizontal"
                    valueSize="md"
                    wrapped
                  />
                  <StatCard
                    value={stats.tags}
                    label="标签"
                    layout="horizontal"
                    valueSize="md"
                    wrapped
                  />
                </div>
              </div>
            </Card>
          </div>

          <Card variant="muted" size="lg">
            <h2 className="text-xl font-semibold mb-4">本站</h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <p>这个博客使用 Next.js构建，用来记录我在技术学习和工作中的心得体会。</p>
              <p>同时也会分享一些关于生活、阅读的想法。</p>
            </div>
          </Card>

          <Card variant="muted" size="lg">
            <h2 className="text-xl font-semibold mb-4">项目</h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <p>本博客是开源的，感兴趣的话麻烦点个Star，你可以在 GitHub 查看源码：</p>
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
        </div>
      </main>

      <Footer />
    </div>
  )
}