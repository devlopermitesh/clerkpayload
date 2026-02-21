'use client'
import { Button } from '@/components/ui/button'
import { useStepper } from '@/modules/providers/StepperForm'
import { CreateOrganization, SignUp, useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const Page = () => {
  const { currentStep } = useStepper()
  const { user, isLoaded } = useUser()
  if (!isLoaded) {
    return null
  }
  switch (currentStep) {
    case 1:
      return redirect('/organizations/sign-up')
    case 2:
      return redirect('/organizations/sign-up')

    case 3:
            return redirect('/organizations/create-organization')

    case 4:
      return <OrganizationSuccess />

    default:
      return <SignUp />
      break
  }
}
export default Page

export const OrganizationSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center space-y-6 p-8">
        <div className="text-6xl">🎉</div>
        <h1 className="text-4xl font-bold text-green-900">Organization Created!</h1>
        <p className="text-lg text-green-700 max-w-md">
          Your organization has been successfully set up. You're all set to start managing your
          library.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <a href="/admin">Go to Admin Dashboard</a>
        </Button>
      </div>
    </div>
  )
}
