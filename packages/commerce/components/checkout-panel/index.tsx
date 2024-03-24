'use client'
import React, { useState }  from 'react'

import { capitalize } from '@hanzo/ui/util'

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
  close: () => void
  className?: string
}> = ({
  close,
  className=''
}) => {

  const cmmc = useCommerce()
    
    // For sites that don't initialize cmmc
  if (!cmmc) {
    return <></>
  }
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [orderId, setOrderId] = useState<string | undefined>(undefined)

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

  const _close = () => {
    setStep('first')
    close()
  }

  const StepToRender = STEPS[stepIndex].Comp  

  return (
    <div /* id='CHECKOUT_PANEL' */  className={className} >
      <DesktopCP 
        className='hidden md:flex h-full flex-row justify-center overflow-y-hidden' 
        close={_close}
        index={stepIndex}
        stepNames={STEP_NAMES}
      >
        <StepToRender onDone={() => {setStep('next')}} orderId={orderId} setOrderId={setOrderId}/>
      </DesktopCP>
      <MobileCP 
        className='md:hidden h-full overflow-y-auto' 
        close={_close}
        index={stepIndex}
        stepNames={STEP_NAMES}
      >
        <StepToRender onDone={() => {setStep('next')}} orderId={orderId} setOrderId={setOrderId}/>
      </MobileCP>
    </div>
  )
}

export default CheckoutPanel
