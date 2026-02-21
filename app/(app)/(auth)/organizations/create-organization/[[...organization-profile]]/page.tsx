'use client'
import { useStepper } from '@/modules/providers/StepperForm'
import { CreateOrganization, useOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { currentStep, goToStep } = useStepper()
  const { organization } = useOrganization()
  const router = useRouter()

  useEffect(() => {
    if (organization) {
      router.replace('/organizations/success-organization')
      return
    }
    if (currentStep === 3) return
    goToStep(3)
  }, [currentStep, goToStep, organization, router])

  return <CreateOrganization afterCreateOrganizationUrl={'/organizations/success-organization'} />
}
export default Page
