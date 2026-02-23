'use client'
import { useStepper } from '@/modules/providers/StepperForm'
import { SignUp, useSignUp } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { isLoaded, signUp } = useSignUp()
  const pathname = usePathname()
  const { currentStep, goToNext, markStepComplete, steps, goToStep } = useStepper()
  const isVerifyEmailStep = pathname.includes('/verify-email-address')
  const isChooseOrgStep = pathname.includes('/tasks/choose-organization')
  useEffect(() => {
    if (!isLoaded) return

    if (isVerifyEmailStep) {
      return goToStep(2)
    }
    if (isChooseOrgStep) {
      return goToStep(3)
    }
    // Clerk sets status to 'complete' once email is verified
    if (signUp.status === 'complete') {
      markStepComplete('sign-up')
    }
  }, [
    currentStep,
    goToNext,
    isLoaded,
    markStepComplete,
    signUp?.status,
    signUp?.unverifiedFields,
    steps,
    pathname,
  ])

  return <SignUp forceRedirectUrl="/organizations/create-organization" routing="hash" />
}
export default Page
