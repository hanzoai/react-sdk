'use client'
import React from 'react'

import { StepIndicator } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'
import { AuthWidget } from '@hanzo/auth/components'

import CloseButton from './close-button'
import CartAccordian from './cart-accordian'

import type CheckoutStep from './step'

// 'flex flex-col md:flex-row justify-center h-full overflow-y-auto md:overflow-y-hidden'

const MobilePanel: React.FC<{
  index: number
  steps: CheckoutStep[]
  onClose:() => void
  className?: string
}> = ({
  index,
  steps,
  onClose,
  className=''
}) => (

  <div /* id='MOBILE_GRID' */ className={cn('bg-background flex flex-col justify-start px-4', className)}>
    <div className='sticky top-0 w-full flex flex-row justify-between items-start'>
      <CloseButton onClose={onClose} className='rounded-full bg-level-1 hover:bg-level-2 hover:border-muted p-1 -ml-1' />
      <StepIndicator 
        dotSizeRem={1} 
        steps={steps.map((s) => (s.label))} 
        currentStep={index} 
        className='text-xs font-semibold w-pr-70 mt-3' 
      />
      {/* Need wrapper div since 'hideLogin' returns null if no logged in user */}
      <div className='w-10 h-10 flex items-center justify-center'><AuthWidget hideLogin className=''/></div>
    </div>
    <CartAccordian className='flex items-center justify-center py-2 mt-2 w-full' />
    {steps[index].element}
  </div>
)


export default MobilePanel
