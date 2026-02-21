'use client'

import { Button } from '@/components/ui/button'
import { useStepper } from '@/modules/providers/StepperForm'
import { useOrganization } from '@clerk/nextjs'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const { organization } = useOrganization()
  const { currentStep, goToStep } = useStepper()
  useEffect(() => {
    if (!organization) {
      router.replace('/')
      return
    }
    if (currentStep == 4) return
    goToStep(4)
  }, [goToStep, currentStep, organization, router])
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Organization Created Successfully</h1>
        <p className="text-gray-600">Your organization has been set up and is ready to use.</p>
        <Button onClick={() => router.push('/admin')} className="mt-6">
          Go to Admin Dashboard
        </Button>
      </div>
    </div>
  )
}

export default Page
