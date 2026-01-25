"use client"

import { Tag } from "./tag"

export interface SelectableTagProps {
  /** 标签文本 */
  tag: string
  /** 是否选中 */
  selected?: boolean
  /** 标签数量（可选） */
  count?: number
  /** 点击事件 */
  onToggle: (tag: string) => void
  /** 自定义类名 */
  className?: string
}

/**
 * 可选择的标签组件
 * 内部使用 Tag 组件，保持 API 一致性
 * 支持选中状态和显示数量
 */
export function SelectableTag({
  tag,
  selected = false,
  count,
  onToggle,
  className,
}: SelectableTagProps) {
  return (
    <Tag
      tag={tag}
      selected={selected}
      count={count}
      onClick={() => onToggle(tag)}
      interactive={true}
      className={className}
    />
  )
}
