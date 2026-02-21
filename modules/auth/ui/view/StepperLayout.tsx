'use client'

import { StepperFormProvider, useStepper } from '@/modules/providers/StepperForm'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Check, Circle } from 'lucide-react'

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = () => {
  const { steps, currentStep, totalSteps } = useStepper()
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <Badge variant="secondary" className="text-xs font-medium">
            {Math.round(progress)}% complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps — horizontal on md+, vertical on mobile */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* connector line */}
        <div className="absolute top-4 left-0 right-0 h-px bg-border mx-8 z-0" />

        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = step.isCompleted

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background',
                  isDone && 'bg-primary border-primary text-primary-foreground',
                  isActive && !isDone && 'border-primary text-primary',
                  !isActive && !isDone && 'border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Label + description */}
              <div className="text-center max-w-[90px]">
                <p
                  className={cn(
                    'text-xs font-semibold leading-tight',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden lg:block">
                  {step.description}
                </p>
              </div>

              {/* Active badge */}
              {isActive && <Badge className="text-[10px] px-1.5 py-0 h-4">Current</Badge>}
            </div>
          )
        })}
      </div>

      {/* Mobile: vertical compact list */}
      <div className="flex md:hidden flex-col gap-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = step.isCompleted

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all',
                isActive && 'border-primary bg-primary/5',
                isDone && 'border-green-500/30 bg-green-500/5',
                !isActive && !isDone && 'border-border opacity-50'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0',
                  isDone && 'bg-primary border-primary text-primary-foreground',
                  isActive && !isDone && 'border-primary text-primary',
                  !isActive && !isDone && 'border-muted-foreground/30 text-muted-foreground/40'
                )}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-xs font-semibold">{stepNumber}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{step.label}</p>
                <p className="text-xs text-muted-foreground truncate">{step.description}</p>
              </div>

              {isActive && <Badge className="text-[10px] shrink-0">Now</Badge>}
              {isDone && (
                <Badge variant="secondary" className="text-[10px] shrink-0 text-green-600">
                  Done
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Active Step Title ────────────────────────────────────────────────────────

const ActiveStepHeader = () => {
  const { steps, currentStep } = useStepper()
  const active = steps[currentStep - 1]

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight">{active.label}</h2>
        <Badge variant="outline" className="text-xs">
          {currentStep}/{steps.length}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{active.description}</p>
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const StepperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-8 md:pt-16">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand / logo area */}
        {/* <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-2">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Get started</h1>
          <p className="text-sm text-muted-foreground">Complete the steps below to set up your account</p>
        </div> */}

        {/* Stepper indicator */}
        <StepIndicator />

        {/* Card wrapping the active step */}
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 border-b">
            <ActiveStepHeader />
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export const StepperFormLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StepperFormProvider>
      <StepperLayout>{children}</StepperLayout>
    </StepperFormProvider>
  )
}

export default StepperFormLayout
