import { NextResponse } from 'next/server'
import { getAllPosts } from '@/app/lib/content'
import { getPaginatedNotesAction } from '@/app/actions/notes'

export async function GET() {
  try {
    // 获取文章数量
    const posts = await getAllPosts()
    
    // 获取随笔数量
    const { total: notesTotal } = await getPaginatedNotesAction(1, 1)
    
    // 获取标签数量
    const tags = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })

    return NextResponse.json({
      posts: posts.length,
      notes: notesTotal,
      tags: tags.size
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 