import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/components/tag';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { delay } from '@/app/lib/utils';

import type { PostMeta as Post } from '@/app/lib/content';

interface NotesContentProps {
  initialData: {
    tags: Array<{ tag: string; count: number }>;
    posts: Post[];
  };
}

function useTags(initialTags: Array<{ tag: string; count: number }>) {
  const [allTags] = useState(initialTags);
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
    handleTagClick,
  };
}

function usePosts(initialPosts: Post[], selectedTag: string | null) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadedTags = useRef<Set<string | null>>(new Set([null]));

  useEffect(() => {
    if (loadedTags.current.has(selectedTag)) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPosts = await getNotesAction(selectedTag);
        setPosts(fetchedPosts);
        loadedTags.current.add(selectedTag);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('加载随笔失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTag]);

  return { posts, loading, error };
}

export function NotesContent({ initialData }: NotesContentProps) {
  const { allTags, selectedTag, isTransitioning, handleTagClick } = useTags(initialData.tags);
  const { posts, loading, error } = usePosts(initialData.posts, selectedTag);

  const tagElements = useMemo(() => {
    if (allTags.length === 0) return null;

    return (
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
    );
  }, [allTags, selectedTag, handleTagClick]);

  const postElements = useMemo(() => (
    <div className={`space-y-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      {loading && posts.length === 0 ? (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-sm text-center py-8">{error}</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Link
            key={post.id}
            to={`/notes/${post.id}`}
            className="block space-y-2 group"
          >
            <h2 className="text-lg font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200">
              {post.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <time>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200"
                      >
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
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-16 text-sm">
          暂无随笔。
        </p>
      )}
    </div>
  ), [loading, error, posts, isTransitioning]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header showBackButton={true} title="随笔" />

      <main>
        {tagElements}
        {postElements}
      </main>

      <Footer />
    </div>
  );
}


async function getNotesAction(selectedTag: string | null): Promise<Post[]> {
  throw new Error('Function not implemented.');
}