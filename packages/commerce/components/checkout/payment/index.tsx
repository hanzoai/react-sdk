'use client'

import { observer } from 'mobx-react-lite'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@hanzo/ui/primitives'
import PayWithCrypto from './pay-with-crypto'
import PayByBankTransfer from './pay-by-bank-transfer'
import PayWithCard from './pay-with-card'
import { useState } from 'react'
import { useCommerce, type TransactionStatus } from '../../..'
import { useAuth } from '@hanzo/auth/service'
import type { UseFormReturn } from 'react-hook-form'

const Payment: React.FC<{
  setCurrentStep: (currentStep: number) => void
  orderId?: string
  setOrderId: (orderId?: string) => void
  contactForm: UseFormReturn<{
    firstName: string
    lastName: string
    email: string
  }, any, {
    firstName: string
    lastName: string
    email: string
  }>,
}> = observer(({
  setCurrentStep,
  orderId,
  setOrderId,
  contactForm
}) => {
  const cmmc = useCommerce()
  const auth = useAuth()
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('unpaid')

  const storePaymentInfo = async (paymentInfo: any) => {
    if (auth.user) {
      const {firstName, lastName, email} = contactForm.getValues()
      let id
      if (!orderId) {
        id = await cmmc.createOrder(email ? email : auth.user.email, `${firstName} ${lastName}`)
        setOrderId(id)
      }
      if (id) {
        await cmmc.updateOrderPaymentInfo(id, paymentInfo)
      }
    }
  }

  return (
    <Tabs defaultValue='card' className='w-full mx-auto max-w-[50rem]'>
      <TabsList className='grid w-full grid-cols-3 mx-auto bg-level-2 h-auto'>
        <TabsTrigger
          value='card'
          className='font-nav whitespace-normal h-full text-sm sm:text-base'
          disabled={transactionStatus === 'paid' || transactionStatus === 'confirmed'}
        >
          PAY WITH CARD
        </TabsTrigger>
        <TabsTrigger
          value='crypto'
          className='font-nav whitespace-normal h-full text-sm sm:text-base'
          disabled={transactionStatus === 'paid' || transactionStatus === 'confirmed'}
        >
          PAY WITH CRYPTO
        </TabsTrigger>
        <TabsTrigger
          value='bank'
          className='font-nav whitespace-normal h-full text-sm sm:text-base'
          disabled={transactionStatus === 'paid' || transactionStatus === 'confirmed'}
        >
          BANK TRANSFER
        </TabsTrigger>
      </TabsList>
      <TabsContent value='card'>
        <PayWithCard
          setCurrentStep={setCurrentStep}
          transactionStatus={transactionStatus}
          setTransactionStatus={setTransactionStatus}
          storePaymentInfo={storePaymentInfo}
          contactForm={contactForm}
        />
      </TabsContent>
      <TabsContent value='crypto'>
        <PayWithCrypto
          setCurrentStep={setCurrentStep}
          transactionStatus={transactionStatus}
          setTransactionStatus={setTransactionStatus}
          storePaymentInfo={storePaymentInfo}
        />
      </TabsContent>
      <TabsContent value='bank'>
        <PayByBankTransfer
          setCurrentStep={setCurrentStep}
          storePaymentInfo={storePaymentInfo}
        />
      </TabsContent>
    </Tabs>
  )
})

export default Payment
