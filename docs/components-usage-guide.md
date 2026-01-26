# 组件使用指南

> 专业、简约、高效的组件 API 文档

本文档提供所有可复用组件的详细 API 说明，包括 Props、使用示例和最佳实践。

---

## 📚 目录

- [基础组件](#基础组件)
- [布局组件](#布局组件)
- [表单组件](#表单组件)
- [反馈组件](#反馈组件)
- [内容组件](#内容组件)
- [导航组件](#导航组件)
- [业务组件](#业务组件)

---

## 基础组件

### Button

通用按钮组件，支持多种变体和尺寸。

**导入：**
```tsx
import { Button } from "@/components/ui/button"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | 按钮变体 |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | 按钮尺寸 |
| `asChild` | `boolean` | `false` | 作为子元素渲染（Radix Slot） |
| `className` | `string` | - | 自定义类名 |
| `...props` | `ButtonHTMLAttributes` | - | 标准 button 属性 |

**示例：**
```tsx
<Button variant="default" size="sm">提交</Button>
<Button variant="outline" onClick={handleClick}>取消</Button>
<Button variant="ghost" asChild>
  <Link href="/about">关于</Link>
</Button>
```

---

### IconButton

图标按钮组件，支持作为按钮或链接使用。

**导入：**
```tsx
import { IconButton } from "@/components/ui/icon-button"
import { Mail, Github } from "lucide-react"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `LucideIcon` | **必需** | Lucide 图标组件 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 按钮尺寸 |
| `active` | `boolean` | `false` | 是否激活状态 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `variant` | `"default" \| "light" \| "transparent"` | `"default"` | 背景变体 |
| `href` | `string` | - | 链接地址（提供则渲染为 `<a>`） |
| `onClick` | `() => void` | - | 点击事件（button 模式） |
| `aria-label` | `string` | - | 无障碍标签 |
| `className` | `string` | - | 自定义类名 |
| `iconClassName` | `string` | - | 图标自定义类名 |
| `children` | `ReactNode` | - | 自定义内容（覆盖 icon） |

**示例：**
```tsx
// 按钮模式
<IconButton
  icon={Mail}
  size="sm"
  onClick={handleClick}
  aria-label="发送邮件"
/>

// 链接模式
<IconButton
  icon={Github}
  href="https://github.com"
  target="_blank"
  aria-label="GitHub"
/>

// 激活状态
<IconButton
  icon={Heart}
  active={isLiked}
  onClick={toggleLike}
/>
```

---

### Card

通用卡片容器组件，支持多种变体和尺寸。

**导入：**
```tsx
import { Card } from "@/components/ui/card"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `"default" \| "elevated" \| "muted"` | `"default"` | 卡片变体 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 内边距尺寸 |
| `rounded` | `"lg" \| "xl" \| "2xl"` | 自动 | 圆角大小（不传则随 size） |
| `hover` | `boolean` | `false` | hover 时阴影增强 |
| `shadow` | `boolean` | `true` | 是否显示阴影 |
| `hoverBg` | `boolean` | `true` | hover 时背景色变化 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**示例：**
```tsx
<Card variant="default" size="md" rounded="xl">
  <h3>标题</h3>
  <p>内容</p>
</Card>

<Card variant="muted" hover shadow={false}>
  悬浮卡片
</Card>
```

---

### ActionButton

操作按钮组件，支持图标、链接和自定义前导内容。

**导入：**
```tsx
import { ActionButton } from "@/components/ui/action-button"
import { Github, Rss } from "lucide-react"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `LucideIcon` | - | 图标（与 leading 二选一） |
| `leading` | `ReactNode` | - | 自定义前导内容（覆盖 icon） |
| `href` | `string` | - | 链接地址（提供则渲染为 `<a>`） |
| `onClick` | `() => void` | - | 点击事件（button 模式） |
| `target` | `string` | - | 链接 target |
| `rel` | `string` | - | 链接 rel |
| `disabled` | `boolean` | `false` | 是否禁用（button 模式） |
| `className` | `string` | - | 自定义类名 |
| `iconClassName` | `string` | - | 图标类名 |
| `children` | `ReactNode` | **必需** | 按钮文本 |

**示例：**
```tsx
// 带图标
<ActionButton icon={Github} href="https://github.com" target="_blank">
  GitHub
</ActionButton>

// 自定义前导
<ActionButton leading="J" href="https://jike.city">
  即刻
</ActionButton>

// 按钮模式
<ActionButton icon={Rss} onClick={handleRss}>
  RSS
</ActionButton>
```

---

## 布局组件

### ResponsiveRow

响应式行布局组件，移动端垂直排列，桌面端水平排列。

**导入：**
```tsx
import { ResponsiveRow } from "@/components/ui/responsive-row"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `gap` | `"sm" \| "md" \| "lg"` | `"md"` | 间距大小 |
| `verticalOnMobile` | `boolean` | `true` | 移动端是否垂直排列 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**示例：**
```tsx
<ResponsiveRow gap="lg">
  <FormField>字段 1</FormField>
  <FormField>字段 2</FormField>
  <FormField>字段 3</FormField>
</ResponsiveRow>
```

---

### FormField

表单字段容器，自动应用 `flex-1 min-w-0` 样式。

**导入：**
```tsx
import { FormField } from "@/components/ui/form-field"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `flex` | `boolean` | `true` | 是否占据剩余空间 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**示例：**
```tsx
<ResponsiveRow>
  <FormField>
    <input type="text" placeholder="标题" />
  </FormField>
  <FormField>
    <DatePicker value={date} onChange={setDate} />
  </FormField>
</ResponsiveRow>
```

---

### SplitDivider

响应式分隔线，移动端水平，桌面端垂直。

**导入：**
```tsx
import { SplitDivider } from "@/components/ui/split-divider"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `"default" \| "muted"` | `"default"` | 分隔线颜色 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**示例：**
```tsx
<div className="flex flex-col lg:flex-row">
  <EditorPane>编辑区</EditorPane>
  <SplitDivider />
  <PreviewPane>预览区</PreviewPane>
</div>
```

---

### EditorWrapper

编辑器包装器，统一垂直内边距。

**导入：**
```tsx
import { EditorWrapper } from "@/components/ui/editor-wrapper"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | 垂直内边距 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**示例：**
```tsx
<EditorWrapper padding="lg">
  <Card>编辑器内容</Card>
</EditorWrapper>
```

---

### EditorPane / PreviewPane

编辑和预览区域容器组件。

**导入：**
```tsx
import { EditorPane, PreviewPane } from "@/components/ui/editor-pane"
```

**EditorPane Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `splitMode` | `boolean` | `false` | 是否在 split 模式下使用（影响高度） |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**PreviewPane Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `splitMode` | `boolean` | `false` | 是否在 split 模式下使用 |
| `variant` | `"default" \| "muted"` | `"default"` | 背景变体 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | 标准 div 属性 |

**示例：**
```tsx
<div className="flex flex-col lg:flex-row">
  <EditorPane splitMode>
    <MarkdownTextarea splitMode />
  </EditorPane>
  <SplitDivider />
  <PreviewPane splitMode variant="muted">
    <PostPreview content={content} />
  </PreviewPane>
</div>
```

---

## 表单组件

### DatePicker

日期选择器组件，基于 `react-day-picker`。

**导入：**
```tsx
import { DatePicker } from "@/components/ui/date-picker"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | - | 日期值（格式：`YYYY-MM-DD`） |
| `onChange` | `(date: string) => void` | **必需** | 日期变更回调 |
| `placeholder` | `string` | `"选择日期"` | 占位符文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `showTodayButton` | `boolean` | `true` | 是否显示"今天"按钮 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
const [date, setDate] = useState("2026-01-26")

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="选择日期"
/>
```

---

### TagInput

标签输入组件，支持回车或逗号添加标签。

**导入：**
```tsx
import { TagInput } from "@/components/ui/tag-input"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string[]` | **必需** | 标签数组 |
| `onChange` | `(tags: string[]) => void` | **必需** | 标签变更回调 |
| `placeholder` | `string` | `"输入标签后按回车"` | 占位符文本 |
| `maxTags` | `number` | `10` | 最大标签数 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
const [tags, setTags] = useState<string[]>([])

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="输入标签后按回车"
  maxTags={10}
/>
```

**交互说明：**
- 按 `Enter` 或 `,` 添加标签
- 输入框为空时按 `Backspace` 删除最后一个标签
- 重复标签会显示警告提示

---

### MarkdownTextarea

Markdown 文本输入框，支持 split 模式。

**导入：**
```tsx
import { MarkdownTextarea } from "@/components/ui/markdown-textarea"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `splitMode` | `boolean` | `false` | 是否在 split 模式下使用（影响高度） |
| `minHeight` | `string \| number` | 自动 | 最小高度（默认：splitMode ? "300px" : "600px"） |
| `placeholder` | `string` | `"粘贴或输入 Markdown 内容..."` | 占位符 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `TextareaHTMLAttributes` | - | 标准 textarea 属性 |

**示例：**
```tsx
<MarkdownTextarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  splitMode={viewMode === "split"}
  placeholder="输入 Markdown..."
/>
```

---

### SimpleTextarea

简洁文本输入框，用于简单文本输入场景。

**导入：**
```tsx
import { SimpleTextarea } from "@/components/ui/simple-textarea"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | 文本大小 |
| `autoFocus` | `boolean` | `false` | 是否自动聚焦 |
| `placeholder` | `string` | `"记录这一刻的想法..."` | 占位符 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `TextareaHTMLAttributes` | - | 标准 textarea 属性 |

**示例：**
```tsx
<SimpleTextarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  size="lg"
  autoFocus
/>
```

---

### SubmitButton

提交按钮组件，统一加载状态和文案。

**导入：**
```tsx
import { SubmitButton } from "@/components/ui/submit-button"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loading` | `boolean` | `false` | 是否加载中 |
| `editing` | `boolean` | `false` | 是否编辑模式 |
| `editText` | `string` | `"更新"` | 编辑时文本 |
| `createText` | `string` | `"发布"` | 新建时文本 |
| `editingLoadingText` | `string` | `"更新中..."` | 编辑加载中文本 |
| `creatingLoadingText` | `string` | `"发布中..."` | 新建加载中文本 |
| `disabled` | `boolean` | - | 是否禁用 |
| `className` | `string` | - | 自定义类名 |
| `...props` | `ButtonHTMLAttributes` | - | 标准 button 属性 |

**示例：**
```tsx
<SubmitButton
  loading={isSubmitting}
  editing={!!editingId}
  editText="更新文章"
  createText="发布文章"
  disabled={!content.trim()}
/>
```

---

## 反馈组件

### LoadingSpinner

加载状态组件，支持消息和全页布局。

**导入：**
```tsx
import { LoadingSpinner, PageLoader } from "@/components/ui/loading-spinner"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | `string` | - | 主消息 |
| `subMessage` | `string` | - | 副消息 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 尺寸 |
| `fullPage` | `boolean` | `false` | 是否全页布局（添加 min-h-[60vh]） |
| `className` | `string` | - | 自定义类名 |

**PageLoader：**
`PageLoader` 是 `LoadingSpinner` 的包装器，自动设置 `fullPage={true}`。

**示例：**
```tsx
// 普通加载
<LoadingSpinner message="加载中..." size="md" />

// 全页加载
<PageLoader
  message="正在验证身份..."
  subMessage="稍等片刻"
  size="lg"
/>
```

---

### EmptyState

空状态组件，用于显示无数据时的提示。

**导入：**
```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { FileText } from "lucide-react"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | `string` | **必需** | 主消息 |
| `description` | `string` | - | 副描述 |
| `icon` | `LucideIcon` | - | 图标 |
| `action` | `ReactNode` | - | 操作按钮 |
| `spacing` | `"sm" \| "md" \| "lg"` | `"md"` | 垂直间距 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
<EmptyState
  message="暂无文章"
  description="去写一篇吧"
  icon={FileText}
  action={<Button>去写一篇</Button>}
  spacing="md"
/>
```

---

### PreviewPlaceholder

预览占位符组件，用于预览区域空状态。

**导入：**
```tsx
import { PreviewPlaceholder } from "@/components/ui/preview-placeholder"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | `string` | **必需** | 提示消息 |
| `italic` | `boolean` | `false` | 是否斜体 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
<PreviewPlaceholder
  message="开始创作，点亮灵感✨"
  italic
/>
```

---

## 内容组件

### Tag / Tags

标签组件，支持普通显示和交互模式。

**导入：**
```tsx
import { Tag, Tags } from "@/components/ui/tag"
```

**Tag Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tag` | `string` | **必需** | 标签文本 |
| `interactive` | `boolean` | `false` | 是否可交互（按钮模式） |
| `selected` | `boolean` | `false` | 是否选中 |
| `count` | `number` | - | 标签数量 |
| `onClick` | `() => void` | - | 点击事件（interactive 模式） |
| `className` | `string` | - | 自定义类名 |

**Tags Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tags` | `string[]` | **必需** | 标签数组 |
| `interactive` | `boolean` | `false` | 是否可交互 |
| `selectedTags` | `string[]` | `[]` | 选中的标签列表 |
| `onTagClick` | `(tag: string) => void` | - | 标签点击事件 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
// 单个标签
<Tag tag="React" interactive onClick={handleClick} />

// 标签组
<Tags
  tags={["React", "Next.js", "TypeScript"]}
  interactive
  selectedTags={selectedTags}
  onTagClick={handleTagClick}
/>

// 带数量
<Tag tag="React" count={5} selected />
```

---

### SelectableTag

可选择的标签组件，内部使用 `Tag` 组件。

**导入：**
```tsx
import { SelectableTag } from "@/components/ui/selectable-tag"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tag` | `string` | **必需** | 标签文本 |
| `selected` | `boolean` | `false` | 是否选中 |
| `count` | `number` | - | 标签数量 |
| `onToggle` | `(tag: string) => void` | **必需** | 切换选中状态回调 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
<SelectableTag
  tag="React"
  count={5}
  selected={selectedTags.includes("React")}
  onToggle={(tag) => handleToggle(tag)}
/>
```

---

### StatCard

统计卡片组件，用于显示数值和标签。

**导入：**
```tsx
import { StatCard } from "@/components/ui/stat-card"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | - | 标签/标题 |
| `value` | `string \| number` | **必需** | 主要数值 |
| `subtitle` | `string` | - | 副标题/说明 |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | 布局方向 |
| `valueSize` | `"sm" \| "md" \| "lg"` | `"md"` | 数值大小 |
| `wrapped` | `boolean` | `false` | horizontal 模式下是否用 Card 包装 |
| `hover` | `boolean` | `false` | 是否启用 hover 效果 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
// 垂直布局（默认，带 Card）
<StatCard
  label="本月创作"
  value={12}
  subtitle="3 文章 · 2 随笔"
  valueSize="lg"
/>

// 水平布局 + wrapped
<StatCard
  value={posts.length}
  label="文章"
  layout="horizontal"
  wrapped
/>

// 水平布局（无 Card，用于已有容器内）
<StatCard
  value={posts.length}
  label="文章"
  layout="horizontal"
  valueSize="sm"
/>
```

---

### MarkdownProse

Markdown 内容渲染容器，使用 `dangerouslySetInnerHTML`。

**导入：**
```tsx
import { MarkdownProse, MARKDOWN_PROSE_CLASSES } from "@/components/ui/markdown-prose"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `html` | `string` | **必需** | HTML 字符串 |
| `className` | `string` | - | 自定义类名 |

**常量：**
- `MARKDOWN_PROSE_CLASSES`：Prose 样式类名常量

**示例：**
```tsx
<MarkdownProse html={processedHtml} />

// 使用样式常量
<div className={cn(MARKDOWN_PROSE_CLASSES, "custom-class")}>
  {/* 自定义渲染 */}
</div>
```

**注意：** 确保传入的 HTML 已清理，避免 XSS 风险。

---

### CopyButton

复制按钮组件，点击后复制文本到剪贴板。

**导入：**
```tsx
import { CopyButton } from "@/components/ui/copy-button"
import { Mail } from "lucide-react"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | **必需** | 要复制的文本 |
| `icon` | `LucideIcon` | - | 图标 |
| `leading` | `ReactNode` | - | 自定义前导内容（覆盖 icon） |
| `children` | `ReactNode` | **必需** | 按钮文本 |
| `onSuccess` | `() => void` | - | 复制成功回调 |
| `onError` | `(error: Error) => void` | - | 复制失败回调 |
| `successMessage` | `string` | `"已复制到剪贴板"` | 成功提示文本 |
| `duration` | `number` | `2000` | 提示显示时长（毫秒） |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
<CopyButton
  icon={Mail}
  value="sxy1308075897@gmail.com"
  successMessage="邮箱已复制"
  onSuccess={() => console.log("复制成功")}
>
  邮箱
</CopyButton>
```

---

## 导航组件

### PaginationButtons

分页按钮组组件，支持页码跳转。

**导入：**
```tsx
import { PaginationButtons } from "@/components/ui/pagination-buttons"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `currentPage` | `number` | **必需** | 当前页码 |
| `totalPages` | `number` | **必需** | 总页数 |
| `onPageChange` | `(page: number) => void` | **必需** | 页码变更回调 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
<PaginationButtons
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

**显示逻辑：**
- 始终显示第一页和最后一页
- 显示当前页及前后各一页
- 其他页码用 `•••` 省略

---

### PageNumberButton

页码按钮组件，复用 `IconButton` 样式体系。

**导入：**
```tsx
import { PageNumberButton } from "@/components/ui/page-number-button"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pageNumber` | `number` | **必需** | 页码 |
| `active` | `boolean` | `false` | 是否激活 |
| `onClick` | `() => void` | **必需** | 点击事件 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 按钮尺寸 |

**示例：**
```tsx
<PageNumberButton
  pageNumber={1}
  active={currentPage === 1}
  onClick={() => onPageChange(1)}
  size="md"
/>
```

---

### MonthNavigation

月份导航组件，用于日历类组件。

**导入：**
```tsx
import { MonthNavigation } from "@/components/ui/month-navigation"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `year` | `number` | **必需** | 当前年份 |
| `month` | `number` | **必需** | 当前月份（0-11） |
| `disableNext` | `boolean` | `false` | 是否禁用"下个月"按钮 |
| `onPrev` | `() => void` | **必需** | 上个月回调 |
| `onNext` | `() => void` | **必需** | 下个月回调 |
| `formatDate` | `(year: number, month: number) => string` | 默认 | 日期格式化函数 |
| `className` | `string` | - | 自定义类名 |

**示例：**
```tsx
<MonthNavigation
  year={2026}
  month={0}
  disableNext={isCurrentMonth}
  onPrev={prevMonth}
  onNext={nextMonth}
/>
```

---

## 业务组件

### CalendarHeatmapFloating

悬浮日历热力图组件，支持显示/隐藏切换。

**导入：**
```tsx
import { CalendarHeatmapFloating } from "@/components/calendar-heatmap-floating"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `posts` | `{ date: string }[]` | **必需** | 文章数据（需包含 date 字段） |
| `notes` | `{ date: string }[]` | - | 随笔数据（需包含 date 字段） |

**特性：**
- 使用 `useLocalStorage` 持久化显示状态
- Fixed 定位在页面左侧
- 仅在桌面端显示（`hidden md:block`）

**示例：**
```tsx
import { getAllPostsMeta, getAllNotesMeta } from "@/app/lib/content"

export default function Page() {
  const posts = getAllPostsMeta()
  const notes = getAllNotesMeta()
  return <CalendarHeatmapFloating posts={posts} notes={notes} />
}
```

---

### CalendarHeatmap

日历热力图本体组件。

**导入：**
```tsx
import { CalendarHeatmap } from "@/components/calendar-heatmap"
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `posts` | `{ date: string }[]` | **必需** | 文章数据 |
| `notes` | `{ date: string }[]` | `[]` | 随笔数据 |

**特性：**
- 支持月份切换
- 显示创作活动热力图
- 底部显示统计卡片

---

## Hooks

### useLocalStorage

localStorage 状态管理 Hook，避免 hydration 错误。

**导入：**
```tsx
import { useLocalStorage } from "@/hooks/use-local-storage"
```

**API：**
```tsx
const [value, setValue] = useLocalStorage<T>(key: string, initialValue: T)
```

**参数：**
- `key`：localStorage 键名
- `initialValue`：初始值

**返回值：**
- `value`：当前值
- `setValue`：更新函数（支持函数式更新）

**示例：**
```tsx
const [showCalendar, setShowCalendar] = useLocalStorage("showCalendar", false)

// 使用
setShowCalendar(true)
setShowCalendar(prev => !prev) // 函数式更新
```

**注意：** 首次渲染始终返回 `initialValue`，避免服务器端和客户端不匹配。

---

### useTagFilter

标签筛选 Hook，统一标签筛选逻辑。

**导入：**
```tsx
import { useTagFilter } from "@/hooks/use-tag-filter"
```

**API：**
```tsx
const { selectedTag, handleTagClick, tagElements } = useTagFilter(
  tags: { tag: string; count: number }[],
  options?: {
    initialSelectedTag?: string | null
    includeAllTag?: boolean
    allTagText?: string
    selectedClassName?: string
  }
)
```

**示例：**
```tsx
const { selectedTag, handleTagClick, tagElements } = useTagFilter(tags, {
  initialSelectedTag: null,
  includeAllTag: true,
  allTagText: "全部"
})

return (
  <div>
    {tagElements}
    {/* 根据 selectedTag 筛选内容 */}
  </div>
)
```

---

### useCodeBlockCopy

代码块复制功能 Hook。

**导入：**
```tsx
import { useCodeBlockCopy } from "@/hooks/use-code-block-copy"
```

**API：**
```tsx
useCodeBlockCopy({
  selector?: string
  successDuration?: number
  enabled?: boolean
})
```

**参数：**
- `selector`：代码块选择器（默认：`'pre'`）
- `successDuration`：成功提示显示时长（默认：2000ms）
- `enabled`：是否启用（默认：true）

**示例：**
```tsx
// 在 Markdown 内容组件中使用
export function MarkdownContent({ content }: Props) {
  useCodeBlockCopy() // 自动为所有 <pre> 添加复制按钮
  return <MarkdownProse html={html} />
}
```

---

## 工具函数

### processMathFormulas

处理 Markdown 内容中的数学公式。

**导入：**
```tsx
import { processMathFormulas } from "@/lib/math-formulas"
```

**API：**
```tsx
const html = processMathFormulas(
  content: string,
  options?: {
    blockFormulaClass?: string
    inlineFormulaClass?: string
    throwOnError?: boolean
  }
)
```

**参数：**
- `content`：原始 Markdown 内容
- `options.blockFormulaClass`：块级公式 CSS 类名（默认：`"katex-block"`）
- `options.inlineFormulaClass`：行内公式 CSS 类名（默认：`"katex-inline"`）
- `options.throwOnError`：是否在出错时抛出异常（默认：false）

**示例：**
```tsx
const html = processMathFormulas("这是行内公式 $x^2$ 和块级公式 $$\\int_0^1 x dx$$")
```

**支持的公式格式：**
- 行内公式：`$...$`
- 块级公式：`$$...$$`

---

## 样式常量

### FLOATING_PANEL_BASE_STYLES

浮层基础样式常量，统一浮层样式。

**导入：**
```tsx
import { FLOATING_PANEL_BASE_STYLES } from "@/components/ui/floating-panel"
```

**使用：**
```tsx
<div className={cn(FLOATING_PANEL_BASE_STYLES, "px-4 py-2")}>
  浮层内容
</div>
```

**包含样式：**
- `rounded-xl`
- `border`
- `shadow`
- `backdrop-blur`
- 背景色和边框色

---

## 最佳实践

### 1. 组件选择

- **通用 UI 基元** → 使用 `components/ui/` 下的组件
- **业务功能组合** → 使用 `components/` 根目录下的组件
- **工具函数** → 使用 `hooks/` 和 `lib/` 下的工具

### 2. 类型安全

所有组件都提供完整的 TypeScript 类型定义，建议启用严格模式：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 3. 样式扩展

组件支持通过 `className` 扩展样式，使用 `cn()` 工具函数合并类名：

```tsx
import { cn } from "@/lib/utils"

<Card className={cn("custom-class", condition && "conditional-class")}>
```

### 4. 无障碍访问

- 所有交互组件都支持 `aria-label`
- 使用语义化 HTML 标签
- 确保键盘导航支持

### 5. 性能优化

- 使用 `React.memo` 包装纯展示组件
- 大型列表使用虚拟滚动
- 图片使用 `OptimizedImage` 组件

---

## 依赖说明

使用这些组件需要以下依赖：

| 依赖 | 用途 |
|------|------|
| `tailwindcss` | 样式框架 |
| `lucide-react` | 图标库 |
| `@radix-ui/*` | 无障碍 UI 组件（Dialog、Popover 等） |
| `date-fns` | 日期处理 |
| `sonner` | Toast 通知 |
| `katex` | 数学公式渲染 |
| `react-day-picker` | 日期选择器 |
| `next-themes` | 主题切换 |

---

**最后更新**: 2026-01-26
