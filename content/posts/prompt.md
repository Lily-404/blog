---
title: "资源卡片生成器 prompt"
date: "2026-08-02"
tags: ["AI","prompt"]
---

做一个「资源卡片生成器 Prompt」。核心目标是：

* 你只输入 URL
* AI 自动分析网站
* 输出适合放到资源网站卡片里的内容
* 风格统一、短、像 Linear / Vercel / Product Hunt 那种介绍方式
* 你可以直接复制到数据库或者 CMS

我建议不要让 AI 输出太长，而是固定结构。

你可以保存下面这个 Prompt：

---

```
你是一名专业的资源网站编辑，负责维护一个高质量网站资源库。

我会给你一个网站链接，你需要访问并分析这个网站，然后生成一张资源卡片信息。

目标：
- 让用户在 5 秒内知道这个网站是什么
- 介绍要简洁、有价值，不写营销废话
- 适合作为资源导航网站中的 Card 内容
- 风格参考 Linear、Vercel、Product Hunt、Awwwards 资源介绍方式

请严格按照以下格式输出：

---

## 网站名称
（填写网站官方名称）

## 一句话介绍
（20-40字以内）
用一句话说明：
- 这个网站是什么
- 核心用途是什么
- 解决什么问题

格式：
「一个用于 XXX 的 XXX 工具/平台/资源库」

示例：
「一个收集高质量 UI 组件和设计资源的开发者工具库」

---

## 详细介绍
（50-100字）

说明：
- 网站主要功能
- 用户可以用它做什么
- 适合哪些人群

不要介绍公司历史，不要写广告语。

---

## 分类
从下面选择最匹配的分类：

Design
- UI Design
- UX Design
- Design System
- Icons
- Illustrations
- Fonts
- Color
- Inspiration

Development
- Frontend
- Backend
- AI Tools
- APIs
- Open Source
- Libraries

Productivity
- Tools
- Notes
- Project Management
- Automation

Resources
- Templates
- Assets
- Courses
- Documentation

Other
- Community
- Marketplace
- Portfolio
- Other


---

## 标签
生成 3-6 个关键词标签。

要求：
- 简短
- 描述网站核心能力
- 使用英文

例如：
UI
Components
React
Design System

---

## 推荐理由
（20-40字）

说明为什么值得收藏。

例如：
「适合快速寻找现代 Web 设计灵感，提高产品设计效率。」

---

## 卡片短标题
（10字以内）

用于网站卡片展示。

例如：
- AI 图片生成
- 极简组件库
- 开发者工具箱


---

输出要求：
1. 不要输出 Markdown 表格
2. 不要添加免责声明
3. 不要解释你的分析过程
4. 只输出最终卡片内容
5. 如果网站信息不足，根据网站主页内容合理推测
6. 保持专业、简洁、高质量
7. 优先突出用户价值，而不是网站功能列表


现在分析这个网站：

{URL}
```

---

实际使用：

你以后只需要输入：

```
https://cal.com/
```

输出类似：

```
## 网站名称
Cal.com

## 一句话介绍
一个开源的在线预约调度平台，用于创建和管理个人或团队日程安排。

## 详细介绍
Cal.com 提供类似 Calendly 的预约管理能力，帮助个人和团队创建会议链接、同步日历、自动安排时间。适合自由职业者、团队协作和 SaaS 产品集成。

## 分类
Productivity
- Tools

## 标签
Scheduling
Calendar
Open Source
Booking

## 推荐理由
简化预约流程，让会议安排更加自动化。

## 卡片短标题
智能预约工具
```

---

另外针对你的资源网站，我建议后期可以再加两个字段：

### 1. 风格标签（很适合你的设计审美）

例如：

```
Style:
Minimal
Modern
Developer
Apple-like
Swiss
Experimental
AI
```

因为现在很多资源网站最大的问题不是分类，而是「感觉」。

比如：

* Linear → Minimal / Developer / SaaS
* Vercel → Developer / Modern / Cloud
* Craft → Productivity / Apple-like

### 2. 推荐等级

例如：

```
Quality:
★★★★★
```

或者：

```
Featured: true
```

方便以后首页展示精选。

这个 Prompt 基本可以直接作为你的资源录入流程。你后续甚至可以让 AI 输出 JSON，直接入库。你这个项目（类似 BrowseBase）非常适合这样做。
