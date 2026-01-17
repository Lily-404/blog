"use client"

import { useState, KeyboardEvent, useRef, useEffect } from "react"
import { X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  maxTags?: number
}

export function TagInput({
  value,
  onChange,
  placeholder = "输入标签后按回车",
  className,
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // 删除最后一个标签
      removeTag(value.length - 1)
    }
  }

  const addTag = () => {
    const tag = inputValue.trim()
    if (!tag) {
      setInputValue("")
      setDuplicateWarning(false)
      return
    }

    if (value.includes(tag)) {
      // 标签已存在，显示警告
      setDuplicateWarning(true)
      setTimeout(() => setDuplicateWarning(false), 2000)
      setInputValue("")
      return
    }

    if (value.length >= maxTags) {
      setInputValue("")
      return
    }

    onChange([...value, tag])
    setInputValue("")
    setDuplicateWarning(false)
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  // 清除警告
  useEffect(() => {
    if (duplicateWarning) {
      const timer = setTimeout(() => setDuplicateWarning(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [duplicateWarning])

  return (
    <div>
      <div
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-800 min-h-[42px] items-center",
          duplicateWarning && "border-yellow-300 dark:border-yellow-700",
          value.length >= maxTags && "border-orange-300 dark:border-orange-700",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-normal bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
              className="ml-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full p-0.5 transition-colors"
              aria-label={`删除标签 ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setDuplicateWarning(false)
            }}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm px-1"
          />
        )}
      </div>
      {duplicateWarning && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          标签已存在，请勿重复添加
        </p>
      )}
      {value.length >= maxTags && (
        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
          最多只能添加 {maxTags} 个标签
        </p>
      )}
      {value.length > 0 && value.length < maxTags && (
        <p className="text-xs text-zinc-500 mt-1">
          已添加 {value.length} 个标签（最多 {maxTags} 个）
        </p>
      )}
    </div>
  )
}
