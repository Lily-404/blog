import { Inter, Plus_Jakarta_Sans, Poppins, JetBrains_Mono, Space_Grotesk, Space_Mono, Doto } from 'next/font/google'

// 原来的 Inter，留作备用
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
})

// 更规则、几何感强的 Plus Jakarta Sans
export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
})

// 圆润一点的 Poppins，用于对比/备用
export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
})

// 规则的等宽英文字体，用于代码区 / 数字
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
})

// Nothing design — display (dot-matrix)
export const doto = Doto({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-doto',
  weight: ['400', '700'],
  fallback: ['Space Mono', 'monospace'],
})

// Nothing design — body / UI
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500'],
  fallback: ['DM Sans', 'system-ui', 'sans-serif'],
})

// Nothing design — data / labels
export const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-space-mono',
  weight: ['400', '700'],
  fallback: ['JetBrains Mono', 'SF Mono', 'monospace'],
})
