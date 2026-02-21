import { checkRole } from '@/utils/roles'
export const isAdminEnabledRoles = async () => {
  const isRole = await checkRole(['super-admin', 'admin', 'editor'])
  return isRole
}
