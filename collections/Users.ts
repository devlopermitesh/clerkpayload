import type { CollectionConfig } from 'payload'
import { isAdminEnabledRoles } from './lib/access/isAdminEnabledRoles'
import { isForbidden } from './lib/access/isForbidden'
import { ClerkStrategy } from './lib/auth/clerk-strategy'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from './lib/access/isSuperAdmin'
const defaultTennatField = tenantsArrayField({
  tenantsArrayFieldName: 'libarys',
  tenantsCollectionSlug: 'librarys',
  tenantsArrayTenantFieldName: 'library',
  arrayFieldAccess: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
  },

  tenantFieldAccess: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
  },
})
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [ClerkStrategy],
  },
  access: {
    read: () => true,
    create: isForbidden,
    update: isForbidden,
    delete: isForbidden,
    admin: isAdminEnabledRoles,
    unlock: isForbidden,
    readVersions: isForbidden,
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
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'super-admin'],
      defaultValue: 'admin',
    },
    {
      ...defaultTennatField,
      admin: {
        ...(defaultTennatField.admin || {}),
        position: 'sidebar',
      },
    },
  ],
}
