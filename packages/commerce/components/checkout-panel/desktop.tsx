'use client'
import React from 'react'

import { ScrollArea, StepIndicator } from '@hanzo/ui/primitives'
import { AuthWidget } from '@hanzo/auth/components'

import CartPanel from '../cart-panel'
import CloseButton from './close-button'

import type CheckoutStep from './step'

const DesktopPanel: React.FC<{
  index: number
  steps: CheckoutStep[]
  onClose:() => void
  className?: string
}> = ({
  index,
  steps,
  onClose,
  className=''
}) => { // 'flex flex-col md:flex-row justify-center h-full overflow-y-auto md:overflow-y-hidden'

  return (
    <div /* id='DT-GRID' */ className={className}>
      <div className='w-full bg-background flex flex-row items-start justify-end'>
        <ScrollArea className='h-full w-full max-w-[750px] relative flex flex-col items-center justify-start px-6 pt-12 pb-9'>
          <CloseButton onClose={onClose} className='absolute top-3 left-3 w-auto h-auto rounded-full bg-level-1 hover:bg-level-2 hover:border-muted p-2' />
          <CartPanel
            className='flex border-none mt-10 w-full max-w-[550px] flex-col'
            noCheckout
            showProductsCarousel
          />
        </ScrollArea>
      </div>
      <ScrollArea className='w-full h-full bg-level-1 flex flex-row items-start justify-start overflow-y-auto'>
        <div className='h-full w-full max-w-[750px] relative flex flex-col items-center gap-6 px-8 pb-6 pt-0'>
          <AuthWidget hideLogin className='hidden md:flex absolute top-4 right-4 '/>
          <div className='bg-level-1 sticky h-[90px] pb-2 w-full top-0 flex justify-center items-end'>
            <StepIndicator 
              dotSizeRem={1.5} 
              steps={steps.map((s) => (s.label))} 
              currentStep={index} 
              className='gap-2 text-base w-pr-70 ' 
            />
          </div>
          {steps[index].element}
        </div>
      </ScrollArea>
    </div>
  )
}

export default DesktopPanel
