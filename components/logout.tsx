'use client'
import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'

interface logoutProps {
  label: string
  className?: string
}
export const LogoutBtn = ({ label, className }: logoutProps) => {
  const { signOut } = useClerk()
  return (
    <Link
      href={'/'}
      className={className}
      onClick={async () => await signOut({ redirectUrl: '/' })}
    >
      Logout
    </Link>
  )
}
