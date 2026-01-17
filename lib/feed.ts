import { Feed } from 'feed';
import fs from 'fs';
import { getAllPosts, type Post } from '@/app/lib/content';

export async function generateRssFeed() {
  const posts = getAllPosts();
  const siteURL = 'https://jimmy-blog.vercel.app';
  const date = new Date();

  const author = {
    name: 'Jimmy',
    email: 'jimmy@example.com',
    link: siteURL,
  };

  const feed = new Feed({
    title: 'Jimmy的博客',
    description: 'Jimmy的个人博客，分享技术、生活和思考。',
    id: siteURL,
    link: siteURL,
    language: 'zh-CN',
    image: `${siteURL}/favicon.ico`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/rss.xml`,
    },
    author,
  });

  posts.forEach((post: Post) => {
    const url = `${siteURL}/posts/${post.id}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      content: post.content,
      author: [author],
      date: new Date(post.date),
      category: post.tags && post.tags.length > 0
        ? post.tags.map(tag => ({ name: tag }))
        : undefined,
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
}
