'use client'

import { useEffect, useState }  from 'react'

import { Dialog, DialogContent, Main, Separator } from '@hanzo/ui/primitives'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

import { EnhHeadingBlockComponent, type EnhHeadingBlock } from '@hanzo/ui/blocks'
import { cn } from '@hanzo/ui/util'
import ShippingInfo from './shipping-info'
import ThankYou from './thank-you'
import { useAuth } from '@hanzo/auth/service'
import PayWithCrypto from './pay-with-crypto'
import PayByBankTransfer from './pay-by-bank-transfer'
import ContactInfo from './contact-info'
import { LoginComponent } from '@hanzo/auth/components'
import { observer } from 'mobx-react-lite'
import { Cart } from '..'
import { useCommerce } from '../../service/context'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
})

const Checkout: React.FC<{isOpen: boolean, toogleCheckout: () => void}> = observer(({isOpen, toogleCheckout}) => {
  const auth = useAuth()
  const cmmc = useCommerce()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank' | undefined>()
  const [orderId, setOrderId] = useState<string>()

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),  
    defaultValues: {
      name: auth.user?.displayName ?? '',
      email: auth.user?.email ?? '',
    },
  })

  useEffect(() => {
    if (auth.loggedIn) {
      contactForm.setValue('name', auth.user?.displayName ?? '')
      contactForm.setValue('email', auth.user?.email ?? '')
    }
  }, [auth.loggedIn])

  const selectPaymentMethod = async (method: 'crypto' | 'bank') => {
    contactForm.handleSubmit(async () => {
      if (auth.user) {
        if (!!orderId) {
          await cmmc.updateOrder(orderId, auth.user.email, method)
        } else {
          const id = await cmmc.createOrder(auth.user.email, method)
          setOrderId(id)
        }
      }
      setPaymentMethod(method)
      setCurrentStep(2)
    })()    
  }


  const step1 = auth.loggedIn ? (
    <ContactInfo form={contactForm} selectPaymentMethod={selectPaymentMethod}/>
  ) : (
    <LoginComponent hideHeader className='max-w-[20rem] mx-auto'/>
  )

  const step2 = paymentMethod === 'crypto' ? (
    <PayWithCrypto setCurrentStep={setCurrentStep}/>
  ) : (
    <PayByBankTransfer setCurrentStep={setCurrentStep}/>
  )

  const step3 = (
    <ShippingInfo orderId={orderId} paymentMethod={paymentMethod} setCurrentStep={setCurrentStep}/>
  )

  const step4 = <ThankYou/>

  const steps = [step1, step2, step3, step4]

  return (
    <Dialog open={isOpen} onOpenChange={toogleCheckout}>
      <DialogContent className="absolute !max-w-none w-full h-full bg-background z-[51]">        
        <Main className='grid grid-cols-5 justify-center gap-8 overflow-y-auto'>
          <Cart hideCheckout className='col-span-2 hidden md:flex justify-center border-none w-full'/>

          <div className='flex flex-col gap-8 sm:gap-14 col-span-5 md:col-span-3 max-w-[40rem] mx-auto'>
            <EnhHeadingBlockComponent block={{blockType: 'enh-heading',
              specifiers: 'center',
              heading: { text: `FINALIZE PAYMENT`, level: 3 },
            } as EnhHeadingBlock}/>
            <div className='flex gap-2 mx-auto items-center text-xxs sm:text-base'>
              <div className={cn('w-6 h-6 rounded-full border border-foreground flex flex-col justify-center items-center', currentStep === 1 ? 'bg-foreground text-muted-4' : '')}>
                1
                <div className='relative text-foreground top-2 h-0 whitespace-nowrap'>Contact info</div>
              </div>
              <Separator className='w-[4rem] sm:w-[6rem]'/>
              <div className={cn('w-6 h-6 rounded-full border border-foreground flex flex-col justify-center items-center', currentStep === 2 ? 'bg-foreground text-muted-4' : '')}>
                2
                <div className='relative text-foreground top-2 h-0 whitespace-nowrap'>Payment</div>
              </div>
              <Separator className='w-[4rem] sm:w-[6rem]'/>
              <div className={cn('w-6 h-6 rounded-full border border-foreground flex flex-col justify-center items-center', currentStep === 3 ? 'bg-foreground text-muted-4' : '')}>
                3
                <div className='relative text-foreground top-2 h-0 whitespace-nowrap'>Shipping info</div>
              </div>
            </div>
            {steps[currentStep - 1]}
          </div>
        </Main>
      </DialogContent>
    </Dialog>
  )
})

export default Checkout
