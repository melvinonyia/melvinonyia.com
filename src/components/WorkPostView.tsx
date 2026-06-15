import type { WorkPost } from '~/lib/content/work'
import { ArticleDetail } from './ArticleDetail'

interface WorkPostViewProps {
  post: WorkPost
  position: number
}

export function WorkPostView({ post }: WorkPostViewProps) {
  return (
    <ArticleDetail
      data={{
        slug: post.slug,
        title: post.title,
        subtitle: post.excerpt || undefined,
        date: post.date,
        category: post.tags[0],
        tags: post.tags,
        coverImage: post.heroImage,
        Body: post.Body,
      }}
      basePath="/work"
    />
  )
}
