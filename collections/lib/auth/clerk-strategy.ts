import { auth } from '@clerk/nextjs/server'
import type { AuthStrategy, AuthStrategyResult } from 'payload'

const getUser = async ({ payload }: { payload: any }) => {
  const { userId } = await auth()

  if (!userId) return null
  console.log('userId', userId)
  const existing = await payload.find({
    collection: 'users',
    where: {
      clerkUserId: {
        equals: userId,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0]
  }

  // auto-create user
  const created = await payload.create({
    collection: 'users',
    data: {
      clerkUserId: userId,
    },
  })

  return created
}

const authenticate = async ({ payload }: { payload: any }): Promise<AuthStrategyResult> => {
  const user = await getUser({ payload })

  if (!user) {
    return { user: null }
  }

  return {
    user,
  }
}

export const ClerkStrategy: AuthStrategy = {
  name: 'clerk-auth',
  authenticate,
}
