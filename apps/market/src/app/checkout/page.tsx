'use client'

import { useState }  from 'react'

import { Footer } from '@hanzo/ui/common'
import { Main } from '@hanzo/ui/primitives'

import siteDef from '../../siteDef'
import BankInfo from './bank-info'
import CryptoPay from './crypto-pay'
import { useCurrentUser } from '@hanzo/auth'
import { redirect } from 'next/navigation'
import ThankYou from './thank-you'
import ChoosePaymentMethod from './choose-payment-method'

const CheckoutPage = () => {
  const {user} = useCurrentUser()
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank'>()
  const [step, setStep] = useState(0)

  if (!user) {
    redirect('/login')
  }

  return (<>
    <Main className='gap-8 md:gap-14 flex flex-col justify-center'>
      {step === 0 ? (
        <ChoosePaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep}/>
      ) : step === 1 ? (
        <>
          {paymentMethod === 'crypto' ? (
            <CryptoPay setStep={setStep}/>
          ) : paymentMethod === 'bank' ? (
            <BankInfo setStep={setStep}/>
          ) : null}
        </>
      ) : (
        <ThankYou/>
      )}
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
  </>)
}

export default CheckoutPage
