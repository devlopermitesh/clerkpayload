'use client'
import { useStepper } from '@/modules/providers/StepperForm'
import { CreateOrganization, useOrganization } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { currentStep, goToStep } = useStepper()
  const { organization } = useOrganization()
  useEffect(() => {
    if (organization) {
      return redirect('/organizations/success-organization')
    }
    if (currentStep === 3) return
    goToStep(3)
  }, [currentStep, goToStep, organization])

  return <CreateOrganization afterCreateOrganizationUrl={'/organizations/success-organization'} />
}
export default Page
