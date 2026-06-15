import type { Essay } from '~/lib/content/writing'
import { ArticleDetail } from './ArticleDetail'
import { Pullquote, Aside } from './mdx'

interface WritingPostViewProps {
  essay: Essay
  essayNumber: number
}

const mdxComponents = { Pullquote, Aside }

export function WritingPostView({ essay }: WritingPostViewProps) {
  return (
    <ArticleDetail
      data={{
        slug: essay.slug,
        title: essay.title,
        subtitle: essay.excerpt || undefined,
        date: essay.date,
        category: essay.tags[0],
        tags: essay.tags,
        coverImage: essay.coverImage,
        Body: essay.Body,
      }}
      basePath="/writing"
      mdxComponents={mdxComponents}
    />
  )
}
