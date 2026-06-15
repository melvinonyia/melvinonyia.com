import { createFileRoute } from '@tanstack/react-router'
import { ServerErrorView } from '~/components/ServerErrorView'
import { serverErrorHead } from '~/lib/seo/serverErrorHead'

export const Route = createFileRoute('/500')({
  head: serverErrorHead,
  component: ServerErrorView,
})
