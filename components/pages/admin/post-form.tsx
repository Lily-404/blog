"use client"

interface PostFormProps {
  title: string
  date: string
  tags: string[]
  onTitleChange: (title: string) => void
  onDateChange: (date: string) => void
  onTagsChange: (tags: string[]) => void
}

export function PostForm({
  title,
  date,
  tags,
  onTitleChange,
  onDateChange,
  onTagsChange,
}: PostFormProps) {
  return (
    <div className="nd-surface p-5 md:p-6 space-y-6">
      <div>
        <label className="nd-label block mb-2" htmlFor="post-title">
          TITLE
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="nd-input !font-[var(--font-space-grotesk)] !text-[16px]"
          placeholder="文章标题"
          required
        />
      </div>

      <div>
        <label className="nd-label block mb-2" htmlFor="post-date">
          DATE
        </label>
        <input
          id="post-date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="nd-input"
        />
      </div>

      <div>
        <label className="nd-label block mb-2" htmlFor="post-tags">
          TAGS
        </label>
        <input
          id="post-tags"
          type="text"
          value={tags.join(", ")}
          onChange={(e) =>
            onTagsChange(
              e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            )
          }
          className="nd-input"
          placeholder="tag1, tag2"
        />
      </div>
    </div>
  )
}
