import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Library, Post } from '@/payload-types'
import { ArrowLeft, Building2 } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = {
  params: Promise<{ 'library-slug': string }>
}

type LibraryPostsResponse = {
  library: Library
  posts: Post[]
  total: number
}

async function getLibraryPosts(librarySlug: string): Promise<LibraryPostsResponse> {
  const headerStore = await headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http'

  if (!host) {
    throw new Error('Unable to resolve host for API request')
  }

  const baseUrl = `${protocol}://${host}`
  const response = await fetch(`${baseUrl}/api/libraries/${encodeURIComponent(librarySlug)}/posts`, {
    cache: 'no-store',
  })

  if (response.status === 404) {
    notFound()
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch posts for library "${librarySlug}"`)
  }

  return response.json()
}

export default async function LibrarySlugPage({ params }: Params) {
  const { 'library-slug': librarySlug } = await params
  const data = await getLibraryPosts(librarySlug)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <Badge variant="secondary" className="px-3 py-1">
          {data.total} posts
        </Badge>
      </div>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold">{data.library.name}</h1>
        <p className="text-sm text-muted-foreground">/{data.library.slug}</p>
      </section>

      {data.posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts in this library yet.</p>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.posts.map((post) => (
            <article key={post.id} className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
              <h2 className="text-base font-semibold">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.description || 'No description'}</p>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {post.context || 'No content'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span>{data.library.name}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
