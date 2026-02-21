import { checkRole } from '@/utils/roles'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  const isSuperAdmin = await checkRole(['super-admin'])
  console.log('IsSuperAdmin', isSuperAdmin)
  if (!isSuperAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }
  const payload = await getPayload({
    config: configPromise,
  })
  const data = payload.find({ collection: 'users', where: {} })

  return Response.json(data)
}
