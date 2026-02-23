import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Post } from './collections/Post'
import { Library } from './collections/library'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      logout: {
        Button: './components/logout#LogoutBtn',
      },
      afterNavLinks: ['./components/Link#UserLink'],
      providers: ['./components/provider/CustomClerkProvider#CustomeClerkProvider'],
    },
  },
  collections: [Users, Media, Post, Library],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      tenantsSlug: 'librarys',
      collections: {
        posts: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
        arrayFieldName: 'librarys',
        arrayTenantFieldName: 'library',
      },
      userHasAccessToAllTenants: (user) => Boolean(user.roles?.includes('super-admin')),
    }),
  ],
})
