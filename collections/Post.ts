import { CollectionConfig } from 'payload'

export const Post: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      minLength: 2,
      maxLength: 40,
      type: 'text',
      required: true,
      admin: {
        description: 'Title Post',
      },
    },
    {
      name: 'description',
      type: 'text',
      minLength: 5,
      maxLength: 60,
      admin: {
        description: 'description for post',
      },
    },
    {
      name: 'context',
      type: 'textarea',
      minLength: 10,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
