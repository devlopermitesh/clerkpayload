import type { CollectionConfig } from 'payload'
import { ClerkStrategy } from './lib/auth/clerk-strategy'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [ClerkStrategy],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      index: true,
      unique: true,
    },
    {
      name: 'clerkUserId',
      label: 'Clerk userId',
      type: 'text',
      unique: true,
      required: true,
      index: true,
    },
  ],
}
