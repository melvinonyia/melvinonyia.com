import { createFileRoute } from '@tanstack/react-router'
import { NotFoundView } from '~/components/NotFoundView'
import { notFoundHead } from '~/lib/seo/notFoundHead'

export const Route = createFileRoute('/404')({
  head: notFoundHead,
  component: NotFoundView,
})
