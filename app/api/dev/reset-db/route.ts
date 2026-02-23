import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const payload = await getPayloadClient()
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    for (const collection of payload.config.collections ?? []) {
      await payload.delete({
        collection: collection.slug,
        where: {},
      })
    }
    console.log('Db clean sucessfully')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.log('Db clean route fail! ', error)
    return NextResponse.json({ ok: false })
  }
}
