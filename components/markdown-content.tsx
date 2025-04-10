"use client"

import { useEffect, useState } from "react"
import { Copy, Check } from "lucide-react"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // 为所有代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('pre')
    
    codeBlocks.forEach((pre, index) => {
      // 创建外层容器
      const wrapper = document.createElement('div')
      wrapper.className = 'relative mb-6 group'
      
      // 创建复制按钮容器
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'absolute right-3 top-3 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200'
      
      // 创建复制按钮
      const copyButton = document.createElement('button')
      copyButton.className = 'p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100'
      copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
      
      // 创建成功提示
      const successMessage = document.createElement('span')
      successMessage.className = 'hidden text-xs text-white bg-black px-2 py-1 rounded-md dark:bg-white dark:text-black'
      successMessage.textContent = '已复制'
      
      // 添加点击事件
      copyButton.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          
          // 立即更新UI状态
          copyButton.style.display = 'none'
          successMessage.style.display = 'block'
          
          // 2秒后恢复原始状态
          setTimeout(() => {
            copyButton.style.display = 'block'
            successMessage.style.display = 'none'
          }, 2000)
        } catch (err) {
          console.error('Failed to copy code:', err)
        }
      })
      
      // 添加元素到容器
      buttonContainer.appendChild(copyButton)
      buttonContainer.appendChild(successMessage)
      
      // 将代码块包装在外层容器中
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(buttonContainer)
    })
    
    // 清理函数
    return () => {
      const wrappers = document.querySelectorAll('div.relative.mb-6.group')
      wrappers.forEach(wrapper => {
        const pre = wrapper.querySelector('pre')
        if (pre) {
          wrapper.parentNode?.insertBefore(pre, wrapper)
        }
        wrapper.remove()
      })
    }
  }, [content])

  return (
    <div 
      className="prose prose-zinc dark:prose-invert prose-sm max-w-none dark:text-zinc-200"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
} 