import { NextResponse } from "next/server"
import { getAllPostsMeta } from "@/app/lib/content"
import { getAllNotesMeta } from "@/app/lib/content"

export async function GET() {
  try {
    const posts = getAllPostsMeta()
    const notes = getAllNotesMeta()
    
    // 获取所有标签及其使用次数
    const tagMap = new Map<string, number>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        })
      }
    })
    
    // 转换为数组并排序
    const tags = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // 只返回前10个常用标签
    
    // 计算最近30天的创作数据（用于日历热力图）
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    const recentPosts = posts.filter(post => {
      const postDate = new Date(post.date)
      return postDate >= thirtyDaysAgo
    })
    
    const recentNotes = notes.filter(note => {
      const noteDate = new Date(note.date)
      return noteDate >= thirtyDaysAgo
    })
    
    // 统计本月和本周的创作数量
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(today.getDate() - today.getDay() + 1) // 本周一
    thisWeek.setHours(0, 0, 0, 0)
    
    const thisMonthPosts = posts.filter(post => new Date(post.date) >= thisMonth).length
    const thisMonthNotes = notes.filter(note => new Date(note.date) >= thisMonth).length
    const thisWeekPosts = posts.filter(post => new Date(post.date) >= thisWeek).length
    const thisWeekNotes = notes.filter(note => new Date(note.date) >= thisWeek).length
    
    return NextResponse.json({
      posts: posts.map(p => ({ date: p.date })),
      notes: notes.map(n => ({ date: n.date })),
      tags,
      stats: {
        totalPosts: posts.length,
        totalNotes: notes.length,
        thisMonthPosts,
        thisMonthNotes,
        thisWeekPosts,
        thisWeekNotes,
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
