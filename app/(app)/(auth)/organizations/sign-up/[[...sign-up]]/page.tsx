'use client'
import { useStepper } from '@/modules/providers/StepperForm'
import { SignUp, useSignUp } from '@clerk/nextjs'
import { useEffect } from 'react'

const Page = () => {
  const { isLoaded, signUp } = useSignUp()
  const { currentStep, goToNext, markStepComplete, steps } = useStepper()

  useEffect(() => {
    if (!isLoaded) return
    if (steps[currentStep - 1].isCompleted) {
      goToNext()
    }
    // Clerk sets status to 'complete' once email is verified
    if (signUp.status === 'complete') {
      markStepComplete('sign-up')
    }

    // Clerk sets this when it's waiting for email OTP
    if (
      signUp.status === 'missing_requirements' &&
      signUp.unverifiedFields.includes('email_address')
    ) {
      goToNext()
    }
  }, [currentStep, goToNext, isLoaded, markStepComplete, signUp.status, signUp.unverifiedFields, steps])

  return <SignUp forceRedirectUrl="/organizations/create-organization" />
}
export default Page
