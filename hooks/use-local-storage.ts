"use client"

import { useState, useEffect } from "react"

/**
 * 自定义 Hook，用于管理 localStorage 状态
 * 确保服务器端和客户端首次渲染一致，避免 hydration 错误
 * 
 * @param key - localStorage 的键名
 * @param initialValue - 初始值
 * @returns [value, setValue] - 当前值和更新函数
 * 
 * @example
 * ```tsx
 * const [showCalendar, setShowCalendar] = useLocalStorage('showCalendar', false)
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // 首次渲染始终使用 initialValue，确保服务器端和客户端一致
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // 客户端挂载后，从 localStorage 读取实际值
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  // 更新函数，同时更新状态和 localStorage
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // 支持函数式更新
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // 在 hydration 完成前，始终返回 initialValue，避免 hydration 不匹配
  // hydration 完成后，返回从 localStorage 读取的实际值
  return [isHydrated ? storedValue : initialValue, setValue]
}
