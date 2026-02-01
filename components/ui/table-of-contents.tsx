"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  html: string
  className?: string
}

/**
 * 生成基于文本的 ID
 */
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * 从 HTML 中提取标题（h2-h6）并生成目录
 * 同时为页面中的标题添加 id（如果还没有的话）
 */
function extractHeadings(html: string): TableOfContentsItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const headings = doc.querySelectorAll("h2, h3, h4, h5, h6")
  
  const items: TableOfContentsItem[] = []
  
  headings.forEach((heading) => {
    const text = heading.textContent?.trim() || ""
    if (!text) return
    
    // 如果没有 id，生成一个基于文本的 id
    let id = heading.id
    if (!id) {
      id = generateId(text)
      heading.id = id
    }
    
    const level = parseInt(heading.tagName.charAt(1))
    items.push({ id, text, level })
  })
  
  return items
}

/**
 * 为页面中的标题添加 id（如果还没有的话）
 */
function ensureHeadingIds() {
  const headings = document.querySelectorAll(".prose h2, .prose h3, .prose h4, .prose h5, .prose h6")
  headings.forEach((heading) => {
    if (!heading.id) {
      const text = heading.textContent?.trim() || ""
      if (text) {
        heading.id = generateId(text)
      }
    }
  })
}

/**
 * 获取当前滚动位置对应的标题 ID
 */
function getCurrentHeadingId(items: TableOfContentsItem[]): string | null {
  if (items.length === 0) return null
  
  const scrollPosition = window.scrollY + 100 // 偏移量，提前高亮
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollBottom = window.scrollY + windowHeight
  
  // 检查是否接近页面底部（距离底部100px以内）
  const isNearBottom = scrollBottom >= documentHeight - 100
  
  // 如果接近底部，直接返回最后一个标题
  if (isNearBottom && items.length > 0) {
    const lastItem = items[items.length - 1]
    const lastElement = document.getElementById(lastItem.id)
    if (lastElement) {
      return lastItem.id
    }
  }
  
  // 否则，从后往前查找第一个满足条件的标题
  for (let i = items.length - 1; i >= 0; i--) {
    const element = document.getElementById(items[i].id)
    if (element && element.offsetTop <= scrollPosition) {
      return items[i].id
    }
  }
  
  // 如果都没找到，返回第一个标题
  return items[0]?.id || null
}

/**
 * 目录导航组件
 * 简约风格，固定在右侧显示
 */
export function TableOfContents({ html, className }: TableOfContentsProps) {
  const [items, setItems] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLUListElement>(null)
  const [showTopFade, setShowTopFade] = useState(false) // 是否显示顶部渐隐
  const [showBottomFade, setShowBottomFade] = useState(false) // 是否显示底部渐隐
  
  useEffect(() => {
    // 确保页面中的标题有 id
    ensureHeadingIds()
    
    // 从 HTML 中提取标题
    const headings = extractHeadings(html)
    setItems(headings)
    
    if (headings.length > 0) {
      setActiveId(headings[0].id)
    }
  }, [html])
  
  // 将活动项滚动到可见区域的辅助函数
  const scrollToActiveItem = (targetId: string) => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    
    // 找到对应的链接元素
    const activeLink = scrollContainer.querySelector(`a[href="#${targetId}"]`) as HTMLElement
    if (!activeLink) return
    
    // 找到对应的 li 元素，检查是否是最后一个项
    const listItem = activeLink.closest('li')
    if (!listItem) return
    
    // 获取所有 li 元素，准确判断是否是最后一个
    const allListItems = Array.from(scrollContainer.querySelectorAll('li'))
    const isLastItem = listItem === allListItems[allListItems.length - 1]
    
    // 使用 getBoundingClientRect 计算元素位置（相对于视口）
    // 然后转换为相对于滚动容器内容的位置
    const containerRect = scrollContainer.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    
    // 计算链接在滚动内容中的位置
    // linkRect.top - containerRect.top 得到链接相对于容器视口的位置
    // 加上 scrollTop 得到链接在滚动内容中的绝对位置
    const linkTop = linkRect.top - containerRect.top + scrollContainer.scrollTop
    const linkBottom = linkTop + activeLink.offsetHeight
    
    const containerHeight = scrollContainer.clientHeight
    const currentScrollTop = scrollContainer.scrollTop
    const maxScroll = scrollContainer.scrollHeight - containerHeight
    
    // 计算可见区域
    const visibleTop = currentScrollTop
    const visibleBottom = currentScrollTop + containerHeight
    const padding = 20 // 边距
    
    // 检查链接是否完全在可见区域内
    const isFullyVisible = linkTop >= visibleTop + padding && linkBottom <= visibleBottom - padding
    
    if (isFullyVisible) {
      // 如果完全可见且有足够边距，不需要滚动
      return
    }
    
    // 如果链接在可见区域上方，向上滚动
    if (linkTop < visibleTop + padding) {
      scrollContainer.scrollTo({
        top: Math.max(0, linkTop - padding),
        behavior: "smooth",
      })
    } 
    // 如果链接在可见区域下方，向下滚动
    else if (linkBottom > visibleBottom - padding) {
      // 对于最后一个项，需要特殊处理
      if (isLastItem) {
        // 最后一个项：确保完全可见
        // 计算需要滚动到的位置，确保链接顶部可见且有边距
        const targetScrollTop = Math.max(0, linkTop - padding)
        // 但不能超过最大滚动位置
        const finalScrollTop = Math.min(targetScrollTop, maxScroll)
        
        scrollContainer.scrollTo({
          top: finalScrollTop,
          behavior: "smooth",
        })
      } else {
        // 对于其他项，确保链接底部可见，并留出边距
        const targetScroll = linkBottom - containerHeight + padding
        scrollContainer.scrollTo({
          top: Math.min(maxScroll, Math.max(0, targetScroll)),
          behavior: "smooth",
        })
      }
    }
  }
  
  useEffect(() => {
    if (items.length === 0) return
    
    const handleScroll = () => {
      // 允许自动高亮更新，即使是在手动点击后的滚动过程中
      // 这样可以实现按顺序依次高亮的效果
      const currentId = getCurrentHeadingId(items)
      setActiveId(currentId)
    }
    
    // 检查导航列表滚动位置，决定是否显示渐隐效果
    const checkFadeVisibility = () => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtTop = scrollTop <= 5 // 允许5px的误差
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
      
      setShowTopFade(!isAtTop)
      setShowBottomFade(!isAtBottom)
    }
    
    // 初始检查
    handleScroll()
    checkFadeVisibility()
    
    // 监听页面滚动
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    // 监听导航列表滚动
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkFadeVisibility, { passive: true })
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (container) {
        container.removeEventListener("scroll", checkFadeVisibility)
      }
    }
  }, [items])
  
  // 当 activeId 改变时，自动滚动导航列表到活动项
  useEffect(() => {
    if (!activeId || items.length === 0) return
    
    // 使用 setTimeout 确保 DOM 已更新
    const timer = setTimeout(() => {
      scrollToActiveItem(activeId)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [activeId, items])
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // 考虑 header 高度
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const targetScrollTop = elementPosition - offset
      
      // 使用自定义平滑滚动，速度适中，让高亮可以按顺序更新
      const startScrollTop = window.scrollY
      const distance = targetScrollTop - startScrollTop
      // 根据距离计算时间，速度更快但仍保持平滑
      const duration = Math.min(Math.abs(distance) * 0.5, 1200) // 最多1.2秒
      const startTime = performance.now()
      
      // 自定义平滑滚动函数
      const smoothScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 使用缓动函数（ease-in-out）
        const easeInOut = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        const currentScrollTop = startScrollTop + distance * easeInOut
        window.scrollTo(0, currentScrollTop)
        
        if (progress < 1) {
          requestAnimationFrame(smoothScroll)
        }
      }
      
      // 开始平滑滚动，允许自动高亮按顺序更新
      requestAnimationFrame(smoothScroll)
      
      // 确保被点击的导航项在导航列表的可见区域内
      // 使用统一的滚动函数确保一致性
      requestAnimationFrame(() => {
        scrollToActiveItem(id)
      })
    }
  }
  
  if (items.length === 0) return null
  
  return (
    <nav
      className={cn(
        "hidden xl:block",
        "w-48",
        "text-xs",
        "max-h-[calc(100vh-8rem)]",
        "overflow-hidden",
        className
      )}
      aria-label="文章目录"
    >
      <div className="relative">
        {/* 目录过长时：内部滚动（不影响正文布局） */}
        <ul 
          ref={scrollContainerRef}
          className="max-h-[calc(100vh-11rem)] overflow-auto pr-1 space-y-0.5"
        >
          {items.map((item) => {
            const isActive = activeId === item.id
            const indent = item.level === 2 ? 0 : item.level === 3 ? 6 : item.level === 4 ? 12 : 16

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "group relative block py-1.5",
                    "text-zinc-400 dark:text-zinc-600",
                    "hover:text-zinc-700 dark:hover:text-zinc-400",
                    isActive && [
                      "text-zinc-900 dark:text-zinc-200",
                    ],
                    "truncate"
                  )}
                  style={{ 
                    paddingLeft: isActive ? `${indent}px` : `${indent + 8}px`,
                    fontSize: isActive ? "0.9375rem" : "0.75rem",
                    lineHeight: isActive ? "1.375rem" : "1rem",
                    fontWeight: isActive ? "500" : "400",
                    willChange: "padding-left, font-size, line-height, color, font-weight",
                    transition: "padding-left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), font-size 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), line-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), font-weight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  }}
                >
                  <span className="relative">{item.text}</span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* 顶部渐隐提示：告诉用户上面还能滚（只在不在顶部时显示） */}
        {showTopFade && (
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-10 bg-gradient-to-b from-background to-transparent z-10 transition-opacity duration-200" />
        )}
        {/* 底部渐隐提示：告诉用户下面还能滚（只在不在底部时显示） */}
        {showBottomFade && (
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent z-10 transition-opacity duration-200" />
        )}
      </div>
    </nav>
  )
}
