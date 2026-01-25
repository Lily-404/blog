"use client"

import { useState, useCallback, useMemo } from "react"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"

export interface UseTagFilterOptions {
  /** 初始选中的标签（null 表示全部） */
  initialSelectedTag?: string | null
  /** 是否包含"全部"标签 */
  includeAllTag?: boolean
  /** "全部"标签的文本，默认 "全部" */
  allTagText?: string
  /** 选中状态的样式类名 */
  selectedClassName?: string
}

export interface UseTagFilterReturn {
  /** 当前选中的标签（null 表示全部） */
  selectedTag: string | null
  /** 标签点击处理函数 */
  handleTagClick: (tag: string | null) => void
  /** 渲染标签的 JSX 元素 */
  tagElements: React.ReactNode
}

/**
 * 标签筛选 Hook
 * 提供标签筛选的状态管理和渲染逻辑
 * 
 * @param tags 标签列表（格式：{ tag: string; count?: number }[]）
 * @param options 配置选项
 * @returns 标签筛选相关的状态和处理函数
 * 
 * @example
 * ```tsx
 * const tags = [{ tag: "React", count: 5 }, { tag: "Vue", count: 3 }]
 * const { selectedTag, handleTagClick, tagElements } = useTagFilter(tags)
 * 
 * return (
 *   <div>
 *     {tagElements}
 *   </div>
 * )
 * // 根据 selectedTag 筛选内容
 * ```
 */
export function useTagFilter(
  tags: Array<{ tag: string; count?: number }>,
  options: UseTagFilterOptions = {}
): UseTagFilterReturn {
  const {
    initialSelectedTag = null,
    includeAllTag = true,
    allTagText = "全部",
    selectedClassName = "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200",
  } = options

  const [selectedTag, setSelectedTag] = useState<string | null>(initialSelectedTag)

  const handleTagClick = useCallback((tag: string | null) => {
    setSelectedTag(tag)
  }, [])

  const tagElements = useMemo(() => {
    if (!tags || tags.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2">
        {includeAllTag && (
          <Tag
            tag={allTagText}
            onClick={() => handleTagClick(null)}
            interactive={true}
            selected={selectedTag === null}
          />
        )}
        {tags.map(({ tag }) => (
          <Tag
            key={tag}
            tag={tag}
            onClick={() => handleTagClick(tag)}
            interactive={true}
            selected={selectedTag === tag}
          />
        ))}
      </div>
    )
  }, [tags, selectedTag, handleTagClick, includeAllTag, allTagText, selectedClassName])

  return {
    selectedTag,
    handleTagClick,
    tagElements,
  }
}
