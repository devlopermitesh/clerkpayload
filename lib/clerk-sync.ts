import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { getPayloadClient } from './payload'

export async function syncUserToPayload(evt: WebhookEvent) {
  const payload = await getPayloadClient()

  switch (evt.type) {
    case 'user.created':
      console.log('User created event received:', evt)

      await (
        await clerkClient()
      ).users.updateUserMetadata(evt.data.id, {
        publicMetadata: {
          roles: ['user'], // Default role for all new users
        },
      })
      {
        const email = resolvePrimaryEmail(evt.data)
        if (!email) {
          throw new Error(`Unable to sync Clerk user ${evt.data.id}: missing primary email`)
        }

        const roles =
          Array.isArray(evt.data.public_metadata.roles) && evt.data.public_metadata.roles.length > 0
            ? evt.data.public_metadata.roles
            : ['user']

        const existingByClerkId = await payload.find({
          collection: 'users',
          where: { clerkUserId: { equals: evt.data.id } },
          limit: 1,
        })

        if (existingByClerkId.docs[0]) {
          await payload.update({
            collection: 'users',
            id: existingByClerkId.docs[0].id,
            data: {
              email,
              firstName: evt.data.first_name || '',
              lastName: evt.data.last_name || '',
              roles,
            },
          })
          break
        }

        // Prevent unique(email) failures on webhook replay or pre-existing records.
        const existingByEmail = await payload.find({
          collection: 'users',
          where: { email: { equals: email } },
          limit: 1,
        })

        if (existingByEmail.docs[0]) {
          await payload.update({
            collection: 'users',
            id: existingByEmail.docs[0].id,
            data: {
              clerkUserId: evt.data.id,
              firstName: evt.data.first_name || '',
              lastName: evt.data.last_name || '',
              roles,
            },
          })
          break
        }

        await payload.create({
          collection: 'users',
          data: {
            clerkUserId: evt.data.id,
            email,
            firstName: evt.data.first_name || '',
            lastName: evt.data.last_name || '',
            roles,
          },
        })
      }
      break

    case 'user.updated':
      {
        const existing = await payload.find({
          collection: 'users',
          where: { clerkUserId: { equals: evt.data.id } },
          limit: 1,
        })
        const email = resolvePrimaryEmail(evt.data)

        if (existing.docs[0]) {
          await payload.update({
            collection: 'users',
            id: existing.docs[0].id,
            data: {
              ...(email ? { email } : {}),
              firstName: evt.data.first_name || '',
              lastName: evt.data.last_name || '',
              roles:
                Array.isArray(evt.data.public_metadata.roles) &&
                evt.data.public_metadata.roles.length > 0
                  ? evt.data.public_metadata.roles
                  : existing.docs[0].roles,
            },
          })
        } else if (email) {
          const existingByEmail = await payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
          })

          if (existingByEmail.docs[0]) {
            await payload.update({
              collection: 'users',
              id: existingByEmail.docs[0].id,
              data: {
                clerkUserId: evt.data.id,
                firstName: evt.data.first_name || '',
                lastName: evt.data.last_name || '',
                roles:
                  Array.isArray(evt.data.public_metadata.roles) &&
                  evt.data.public_metadata.roles.length > 0
                    ? evt.data.public_metadata.roles
                    : existingByEmail.docs[0].roles,
              },
            })
          }
        }
      }
      break

    case 'user.deleted':
      const user = await payload.find({
        collection: 'users',
        where: { clerkUserId: { equals: evt.data.id! } },
      })

      if (user.docs[0]) {
        await payload.delete({
          collection: 'users',
          id: user.docs[0].id,
        })
      }
      break
    case 'organization.created':
      {
        const client = await clerkClient()
        let existingLibrary = await payload.find({
          collection: 'librarys',
          where: { organizationId: { equals: evt.data.id } },
          limit: 1,
        })
        let libraryDoc = existingLibrary.docs?.[0]

        if (!libraryDoc) {
          libraryDoc = await payload.create({
            collection: 'librarys',
            overrideAccess: true,
            data: {
              organizationId: evt.data.id,
              name: evt.data.name,
              slug: evt.data.slug,
            },
          })
        }

        // Promote the creator of this organization to author in Clerk and Payload.
        const memberships = await client.organizations.getOrganizationMembershipList({
          organizationId: evt.data.id,
        })

        const preferredMember =
          memberships.data.find((m) => m.role === 'org:author') ||
          memberships.data.find((m) => Boolean(m.publicUserData?.userId))

        const creatorUserId = preferredMember?.publicUserData?.userId

        if (creatorUserId) {
          await client.users.updateUserMetadata(creatorUserId, {
            publicMetadata: {
              roles: ['author'],
            },
          })

          const existingUser = await payload.find({
            collection: 'users',
            where: { clerkUserId: { equals: creatorUserId } },
            limit: 1,
          })

          if (existingUser.docs[0]) {
            await payload.update({
              collection: 'users',
              id: existingUser.docs[0].id,
              data: {
                librarys: [
                  {
                    library: libraryDoc.id,
                  },
                ],
                roles: ['author'],
              },
            })
          }
        }
      }

      break
    case 'organization.updated':
      {
        const existingLibrary = await payload.find({
          collection: 'librarys',
          where: { organizationId: { equals: evt.data.id } },
          limit: 1,
        })
        console.log('evt data', evt)
        let libraryDoc = existingLibrary.docs?.[0]

        if (libraryDoc) {
          await payload.update({
            collection: 'librarys',
            id: libraryDoc.id,
            overrideAccess: true,
            data: {
              name: evt.data.name,
              slug: evt.data.slug,
            },
          })
        } else {
          await payload.create({
            collection: 'librarys',
            overrideAccess: true,
            data: {
              organizationId: evt.data.id,
              name: evt.data.name,
              slug: evt.data.slug,
            },
          })
        }
        console.log('organization updated ', libraryDoc)
      }
      break
    case 'organization.deleted':
      {
        const existingLibrary = await payload.find({
          collection: 'librarys',
          where: { organizationId: { equals: evt.data.id } },
          limit: 1,
        })

        if (existingLibrary.docs[0]) {
          await payload.delete({
            collection: 'librarys',
            id: existingLibrary.docs[0].id,
            overrideAccess: true,
          })
        }
      }
      break
  }
}

function resolvePrimaryEmail(
  user: WebhookEvent['data'] & {
    email_addresses?: Array<{ id?: string; email_address?: string }>
    primary_email_address_id?: string | null
  }
) {
  const byPrimaryId = user.email_addresses?.find(
    (emailAddress) => emailAddress.id === user.primary_email_address_id
  )?.email_address

  const fallback = user.email_addresses?.[0]?.email_address
  const email = (byPrimaryId || fallback || '').trim().toLowerCase()

  return email || undefined
}
