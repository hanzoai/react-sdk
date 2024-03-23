'use client'

import { useState }  from 'react'

import { Dialog, DialogPortal } from '@hanzo/ui/primitives'
import { cn, capitalize } from '@hanzo/ui/util'

import { useCommerce } from '../..'

import type { CheckoutStep } from './steps/types'

import ShippingInfo from './steps/shipping-info'
import ThankYou from './steps/thank-you'
import Payment from './steps/payment'

const STEPS = [
  {
    name: 'payment',
    Comp: Payment
  }, 
  {
    name: 'delivery',
    Comp: ShippingInfo
  }, 
  {
    name: 'done',
    label: 'Done!',
    Comp: ThankYou
  }
] satisfies CheckoutStep[]

const STEP_NAMES = STEPS.map((s) => (s.label ? s.label : capitalize(s.name)))

import DesktopCP from './desktop'
import MobileCP from './mobile'

const CheckoutPanel: React.FC<{
  open: boolean
  onCheckoutClose: () => void
}> = ({
  open,
  onCheckoutClose
}) => {

  const cmmc = useCommerce()
    
    // For sites that don't initialize cmmc
  if (!cmmc) {
    return <></>
  }
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [orderId, setOrderId] = useState<string>()

    // Step.name or 'first' or 'next' or 'last' 
  const setStep = (name: string): void => {

    if (name === 'first') {
      setStepIndex(0)
    }
    else if (name === 'last') {
      setStepIndex(STEPS.length - 1)
    } 
    else if (name === 'next') {
      if (stepIndex < STEPS.length - 2) {
        setStepIndex(stepIndex + 1)
      }
      else {
        throw new Error('CheckoutPanel.setStep(): Attempting to advance past last step!')
      }
    } 
    else {
      const indexFound = STEPS.findIndex((el) => (el.name === name))
      if (indexFound !== -1) {
        setStepIndex(indexFound)
      }
      else {
        throw new Error('CheckoutPanel.setStep(): Step named ' + name + ' not found!')
      }
    }
  } 

  const onClose = () => {
    setStep('first')
    onCheckoutClose()
  }

  const StepToRender = STEPS[stepIndex].Comp  

  return (
    <Dialog open={open}>
    <DialogPortal>
      <div id='PORTAL_OUTER'  className={cn(
        'fixed w-full h-[100vh] top-0 !max-w-none',
        'animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10',
        'sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
        'shadow-lg bg-transparent backdrop-blur-sm z-50'
      )}>
        <DesktopCP 
          className='hidden md:flex h-full flex-row justify-center overflow-y-hidden' 
          onClose={onClose}
          index={stepIndex}
          stepNames={STEP_NAMES}
        >
          <StepToRender onDone={() => {setStep('next')}} orderId={orderId} setOrderId={setOrderId}/>
        </DesktopCP>
        <MobileCP 
          className='md:hidden h-full overflow-y-auto' 
          onClose={onClose}
          index={stepIndex}
          stepNames={STEP_NAMES}
        >
          <StepToRender onDone={() => {setStep('next')}} orderId={orderId} setOrderId={setOrderId}/>
        </MobileCP>
      </div>
    </DialogPortal>
    </Dialog>
  )
}

export default CheckoutPanel
