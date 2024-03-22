'use client'

import { useState }  from 'react'

import { Dialog, DialogPortal } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../..'

import type CheckoutStep from './step'

import ShippingInfo from './shipping-info'
import ThankYou from './thank-you'
import Payment from './payment'

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
    // one based
  const [step, setStep] = useState<number>(1)
  const [orderId, setOrderId] = useState<string>()

  const steps = [
    {
      label: 'Payment',
      element: (
        <Payment
          orderId={orderId} 
          setOrderId={setOrderId}
          setStep={setStep}
        />
      )
    }, 
    {
      label: 'Delivery',
      element: (<ShippingInfo orderId={orderId} setStep={setStep}/>)
    }, 
    {
      label: 'Done!',
      element: (<ThankYou/> )
    }
  ] satisfies CheckoutStep[]

  const onClose = () => {
    setStep(1)
    onCheckoutClose()
  }

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
          index={step - 1}
          steps={steps}
        />
        <MobileCP 
          className='md:hidden h-full overflow-y-auto' 
          onClose={onClose}
          index={step - 1}
          steps={steps}
        />
      </div>
    </DialogPortal>
    </Dialog>
  )
}

export default CheckoutPanel
