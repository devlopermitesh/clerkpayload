import type { CollectionConfig } from 'payload'
import { isAdminEnabledRoles } from './lib/access/isAdminEnabledRoles'
import { isForbidden } from './lib/access/isForbidden'
import { ClerkStrategy } from './lib/auth/clerk-strategy'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from './lib/access/isSuperAdmin'
const defaultTennatField = tenantsArrayField({
  tenantsArrayFieldName: 'librarys',
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
      name: 'clerkUserId',
      label: 'Clerk userId',
      type: 'text',
      unique: true,
      required: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      options: ['author', 'super-admin', 'user'],
      hasMany: true,
      defaultValue: 'user',
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
