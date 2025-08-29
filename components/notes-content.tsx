import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from './Tag';
import { Skeleton } from './Skeleton';
import { Header } from './Header';
import { Footer } from './Footer';
import { delay } from '@/app/lib/utils';

function useTags(initialTags: Array<{ tag: string; count: number }>) {
  const [allTags, setAllTags] = useState(initialTags);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTagClick = useCallback(async (tag: string | null) => {
    setIsTransitioning(true);
    setSelectedTag(tag);
    await delay(300);
    setIsTransitioning(false);
  }, []);

  return {
    allTags,
    selectedTag,
    isTransitioning,
    handleTagClick
  };
}

function usePosts(initialPosts: Post[], selectedTag: string | null) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedTags] = useState(new Set<string | null>([null]));

  useEffect(() => {
    const fetchData = async () => {
      if (loadedTags.has(selectedTag)) {
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const fetchedPosts = await getNotesAction(selectedTag);
        setPosts(fetchedPosts);
        loadedTags.add(selectedTag);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('加载文章失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTag, loadedTags]);

  return {
    posts,
    loading,
    error
  };
}

export function NotesContent({ initialData }: NotesContentProps) {
  const { allTags, selectedTag, isTransitioning, handleTagClick } = useTags(initialData.tags);
  const { posts, loading, error } = usePosts(initialData.posts, selectedTag);

  const tagElements = useMemo(() => (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <Tag
          tag="全部"
          onClick={() => handleTagClick(null)}
          interactive={true}
          className={selectedTag === null ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200' : ''}
        />
        {allTags.map(({ tag }) => (
          <Tag
            key={tag}
            tag={tag}
            onClick={() => handleTagClick(tag)}
            interactive={true}
            className={selectedTag === tag ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200' : ''}
          />
        ))}
      </div>
    </div>
  ), [allTags, selectedTag, handleTagClick]);

  const postElements = useMemo(() => (
    <div className={`space-y-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      {loading && posts.length === 0 ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/notes/${post.id}`}
            className="block space-y-2 group"
          >
            <h2 className="text-lg font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200">
              {post.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <time>{new Date(post.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</time>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <div className="flex gap-1">
                    {post.tags.map((tag) => (
                      <span key={tag} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          暂无文章。
        </p>
      )}
    </div>
  ), [loading, error, posts, isTransitioning]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header showBackButton={true} title="随笔" />

      <main>
        {allTags.length > 0 && tagElements}

        {postElements}
      </main>

      <Footer />
    </div>
  )
} 

function getNotesAction(selectedTag: string | null) {
  throw new Error('Function not implemented.');
}
