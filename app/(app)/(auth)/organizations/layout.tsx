'use client'
import StepperFormLayout from '@/modules/auth/ui/view/StepperLayout'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex-1 bg-red-500 overflow-y-auto">
        <StepperFormLayout>{children}</StepperFormLayout>
      </div>
      <div
        className="flex-1 bg-cover bg-right bg-no-repeat"
        style={{
          backgroundImage: "url('/sign.jpeg')",
        }}
      />
    </div>
  )
}
export default Layout
