"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileIdInputProps {
  value: string
  onChange: (value: string) => void
  contentType: "post" | "note"
  placeholder?: string
  className?: string
}

export function FileIdInput({
  value,
  onChange,
  contentType,
  placeholder,
  className,
}: FileIdInputProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{
    exists: boolean
    message?: string
  } | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // 格式化文件 ID
  const formatFileId = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-") // 替换非法字符为连字符
      .replace(/-+/g, "-") // 合并多个连字符
      .replace(/^-|-$/g, "") // 移除首尾连字符
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFileId(e.target.value)
    onChange(formatted)
  }

  // 检查文件是否存在
  useEffect(() => {
    if (!value.trim()) {
      setCheckResult(null)
      return
    }

    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 防抖：500ms 后检查
    debounceTimerRef.current = setTimeout(async () => {
      setIsChecking(true)
      try {
        const response = await fetch("/api/validation/file-exists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: contentType,
            fileId: value,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setCheckResult(data)
        } else {
          setCheckResult(null)
        }
      } catch (error) {
        setCheckResult(null)
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [value, contentType])

  const isValidFormat = /^[a-z0-9_-]*$/.test(value)

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full h-9 px-3 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md dark:bg-zinc-950 dark:text-zinc-100 bg-white text-zinc-900 pr-9 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent transition-all",
            !isValidFormat && value && "border-red-300 dark:border-red-700",
            checkResult?.exists && "border-yellow-300 dark:border-yellow-700",
            className
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
          ) : checkResult?.exists ? (
            <CheckCircle2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          ) : value && isValidFormat ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : value && !isValidFormat ? (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          ) : null}
        </div>
      </div>
      {checkResult?.message && (
        <p
          className={cn(
            "text-xs mt-1",
            checkResult.exists
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {checkResult.message}
        </p>
      )}
      {!isValidFormat && value && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          文件 ID 只能包含小写字母、数字、连字符和下划线
        </p>
      )}
      {!checkResult?.message && value && isValidFormat && (
        <p className="text-xs text-zinc-500 mt-1">
          用于 URL，如: /{contentType === "post" ? "posts" : "notes"}/{value || "your-id"}
        </p>
      )}
    </div>
  )
}
