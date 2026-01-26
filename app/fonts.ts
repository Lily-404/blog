import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'], // 只加载拉丁字符集，减少字体文件大小
  display: 'swap', // 使用 swap 避免 FOIT（Flash of Invisible Text）
  preload: true, // 预加载字体以提升性能
  variable: '--font-inter', // 使用 CSS 变量以便在全局样式中使用
  fallback: ['system-ui', 'arial'], // 字体加载失败时的回退字体
}) 