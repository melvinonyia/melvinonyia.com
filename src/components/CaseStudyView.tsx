import type { CaseStudy } from '~/lib/content/work'
import { DetailLayout } from './DetailLayout'

interface CaseStudyViewProps {
  caseStudy: CaseStudy
  position: number
}

export function CaseStudyView({ caseStudy }: CaseStudyViewProps) {
  return (
    <DetailLayout
      data={{
        slug: caseStudy.slug,
        title: caseStudy.title,
        dek: caseStudy.dek || undefined,
        published: caseStudy.published,
        category: caseStudy.tags[0],
        tags: caseStudy.tags,
        leadImage: caseStudy.leadImage,
        Body: caseStudy.Body,
      }}
      basePath="/work"
    />
  )
}
