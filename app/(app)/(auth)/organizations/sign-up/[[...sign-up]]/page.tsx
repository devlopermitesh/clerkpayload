'use client'
import { useStepper } from '@/modules/providers/StepperForm'
import { SignUp, useSignUp } from '@clerk/nextjs'
import { useEffect } from 'react'

const Page = () => {
  const { isLoaded, signUp } = useSignUp()
  const { currentStep, goToNext, markStepComplete, steps } = useStepper()
  console.log('currentstep', currentStep)
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
  }, [isLoaded, signUp?.status])
  return <SignUp afterSignOutUrl={'/organizations/create-organization'} />
}
export default Page
