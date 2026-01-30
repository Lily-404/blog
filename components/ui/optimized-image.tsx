"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  quality?: number // 默认 75
  sizes?: string // 响应式尺寸
}

// 全局缓存所有图片加载状态（内存，用于当前会话）
const globalImageLoadedMap = new Map<string, boolean>();

const STORAGE_KEY_PREFIX = "img-loaded-";

/** 检查图片是否已在本会话中加载过（内存 + sessionStorage，解决移动端切页后重新显示加载的问题） */
function isImageLoadedInSession(src: string): boolean {
  if (globalImageLoadedMap.get(src)) return true;
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(STORAGE_KEY_PREFIX + src) === "1") {
      globalImageLoadedMap.set(src, true);
      return true;
    }
  } catch {
    // sessionStorage 不可用（隐私模式等）时忽略
  }
  return false;
}

/** 标记图片已加载（同时写入内存和 sessionStorage） */
function markImageLoaded(src: string): void {
  globalImageLoadedMap.set(src, true);
  try {
    sessionStorage.setItem(STORAGE_KEY_PREFIX + src, "1");
  } catch {
    // 忽略
  }
}

function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  quality = 75,
  sizes,
  ...props
}: OptimizedImageProps) {
  // 使用 useMemo：优先读内存，再读 sessionStorage，避免移动端切页后仍显示加载占位
  const isCached = useMemo(() => isImageLoadedInSession(src), [src]);
  const [isLoading, setIsLoading] = useState(() => !isImageLoadedInSession(src));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // 如果图片已经在全局缓存中，直接设置为已加载
    if (isCached) {
      setIsLoading(false);
      setIsError(false);
      return;
    }

    // 检查浏览器缓存：使用更可靠的方法检测图片是否已缓存
    let timeoutId: NodeJS.Timeout | null = null;
    let img: HTMLImageElement | null = null;
    let isResolved = false;

    const resolve = () => {
      if (!isResolved) {
        isResolved = true;
        setIsLoading(false);
        markImageLoaded(src);
      }
    };

    const checkCache = () => {
      // 方法1: 检查是否已经有相同src的图片元素在DOM中
      const existingImg = document.querySelector(`img[src="${src}"]`) as HTMLImageElement;
      if (existingImg?.complete) {
        resolve();
        return;
      }

      // 方法2: 创建临时图片对象检查浏览器缓存
      img = document.createElement('img');
      
      img.onload = resolve;
      img.onerror = () => {
        // 即使出错也标记为已处理，让 Next.js Image 组件处理
        if (!isResolved) {
          isResolved = true;
          setIsLoading(true);
        }
      };

      img.src = src;

      // 如果图片已经在浏览器缓存中，complete 会立即为 true
      if (img.complete) {
        resolve();
      } else {
        // 设置超时，避免长时间等待
        timeoutId = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            setIsLoading(true);
          }
        }, 100);
      }
    };

    checkCache();

    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (img) {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
    };
  }, [src, isCached]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    markImageLoaded(src);
  }, [src]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsError(true);
  }, []);

  // 判断是否为头像（圆形图片）
  const isAvatar = src === "/cat.jpg" || className?.includes("rounded-full");

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* 底部基础占位符：未缓存时显示，防止时间线竖线透出；已缓存时不显示，避免随笔页切回时闪「底」 */}
      {!isCached && (
        isAvatar ? (
          <div className="absolute inset-0 z-0 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900" />
        ) : (
          <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900" />
        )
      )}

      {/* Loading placeholder - 模糊动态效果，在基础占位符上方 */}
      {isLoading && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {isAvatar ? (
            // 圆形头像：模糊动态效果
            <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 animate-pulse" 
                   style={{
                     filter: 'blur(8px)',
                     transform: 'scale(1.1)',
                     animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                   }} />
            </div>
          ) : (
            // 方形图片：模糊动态效果
            <div className="w-full h-full rounded-lg overflow-hidden">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 animate-pulse"
                   style={{
                     filter: 'blur(8px)',
                     transform: 'scale(1.1)',
                     animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                   }} />
            </div>
          )}
        </div>
      )}

      {/* Error placeholder */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-zinc-900 z-20 rounded-full">
          <span className="text-zinc-400 dark:text-zinc-500 text-xs">加载失败</span>
        </div>
      )}

      {/* Main image - 模糊到清晰的动态效果，在最上层 */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "relative z-20 transition-all duration-700 ease-out",
          isLoading && !isCached 
            ? "opacity-0 blur-xl scale-110" 
            : "opacity-100 blur-0 scale-100",
          isError && "hidden"
        )}
        loading={priority ? undefined : "lazy"}
        {...props}
      />
    </div>
  )
}

// 使用 memo 优化，避免不必要的重新渲染
export const OptimizedImage = memo(OptimizedImageComponent, (prevProps, nextProps) => {
  // 自定义比较函数，只在关键属性变化时重新渲染
  return (
    prevProps.src === nextProps.src &&
    prevProps.alt === nextProps.alt &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.priority === nextProps.priority &&
    prevProps.className === nextProps.className &&
    prevProps.quality === nextProps.quality &&
    prevProps.sizes === nextProps.sizes
  )
}) 