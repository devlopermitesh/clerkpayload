import payloadConfig from '@/payload.config'
import { getPayload } from 'payload'

type Params = {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params
  const payload = await getPayload({ config: payloadConfig })

  const libraries = await payload.find({
    collection: 'librarys',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const library = libraries.docs[0]

  if (!library) {
    return Response.json({ message: `Library "${slug}" not found` }, { status: 404 })
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    sort: '-createdAt',
    where: {
      tenant: {
        equals: library.id,
      },
    },
  })

  return Response.json({
    library,
    posts: posts.docs,
    total: posts.totalDocs,
  })
}
