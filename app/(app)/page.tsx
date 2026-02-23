import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import payloadConfig from '@/payload.config'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Book, Building2, User } from 'lucide-react'
import Link from 'next/link'
import type { Library, Post } from '@/payload-types'
import { getPayload } from 'payload'

export default async function Home() {
  const user = await auth()
  const payload = await getPayload({
    config: payloadConfig,
  })
  const libraries = await payload.find({
    collection: 'librarys',
    sort: 'name',
    limit: 100,
  })
  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 24,
    sort: '-createdAt',
  })

  const getLibraryFromPost = (post: Post): Library | null => {
    if (!post.tenant || typeof post.tenant === 'string') return null
    return post.tenant
  }

  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="flex justify-between items-center p-4 gap-4 bg-primary min-h-16">
        <span className="text-center flex items-center justify-center gap-2 text-white">
          <Book className="w-8 h-8" />
          <h2 className="text-white font-medium text-2xl italic">Library Stories</h2>
        </span>
        <div className="flex items-center justify-center gap-3">
          {!user.orgId && user.orgRole != 'org:author' && (
            <Link
              href={`${user?.userId ? '/organizations/create-organization' : '/organizations'}`}
            >
              <Button
                className="text-[#6c47ff] text-white bg-primary hover:bg-[#6c47ff] hover:text-white text-xl cursor-pointer"
                variant="outline"
              >
                Create your Library
              </Button>
            </Link>
          )}

          {/* Show the sign-in and sign-up buttons when the user is signed out */}
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          {/* Show the user button when the user is signed in */}
          <SignedIn>
            <Button asChild variant="secondary">
              <Link href="/admin">Admin account</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Browse Libraries</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex w-max gap-2">
              {libraries.docs.map((library) => (
                <Badge key={library.id} asChild variant="outline" className="px-3 py-1 text-sm">
                  <Link href={`/library/${library.slug}`}>{library.name}</Link>
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Latest Posts</h3>
          {result.docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts found yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((post) => {
                const postLibrary = getLibraryFromPost(post)

                return (
                  <article
                    key={post.id}
                    className="rounded-lg border bg-card p-4 shadow-sm space-y-3"
                  >
                    <h4 className="text-base font-semibold">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.description || 'No description'}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.context || 'No content'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {postLibrary ? (
                        <Link
                          className="underline underline-offset-2 hover:text-foreground"
                          href={`/library/${postLibrary.slug}`}
                        >
                          {postLibrary.name}
                        </Link>
                      ) : (
                        <span>Unassigned library</span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
