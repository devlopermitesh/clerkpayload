import { CollectionConfig } from 'payload'

export const Library: CollectionConfig = {
  slug: 'librarys',
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
  ],
}
