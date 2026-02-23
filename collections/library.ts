import { CollectionConfig } from 'payload'

export const Library: CollectionConfig = {
  slug: 'librarys',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,

    create: () => false,
    update: ({ req: { user } }) => {
      return !!user && (user.roles?.includes('author') || user.roles?.includes('super-admin'))
        ? true
        : false
    },
    delete: ({ req: { user } }) => {
      return !!user && (user.roles?.includes('author') || user.roles?.includes('super-admin'))
        ? true
        : false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'your library url host slug.',
      },
    },
    {
      name: 'organizationId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
