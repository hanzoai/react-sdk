'use client'
import React from 'react'

import { Button } from '@hanzo/ui/primitives'
import { type EnhHeadingBlock, EnhHeadingBlockComponent } from '@hanzo/ui/blocks'
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '@hanzo/cart/service'
import { formatPrice } from '@hanzo/cart/util'

import CartLineItem from '../store/cart-line-item' // :aa todo

const ChoosePaymentMethod: React.FC<{
  paymentMethod?: 'crypto' | 'bank',
  setPaymentMethod: (paymentMethod: 'crypto' | 'bank') => void,
  setStep: (step: number) => void
}> = ({
  paymentMethod, 
  setPaymentMethod, 
  setStep
}) => {

  const c = useCommerce()

  const cart = (
    <div className='border p-6 rounded-lg w-full max-w-[70rem] mx-auto'>
      {c.cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (<>
        {c.cartItems.map((item, i) => (<CartLineItem item={item} key={item.product.sku} className='mb-2'/>))}
        <p className='mt-6 text-right border-t pt-1'>TOTAL: {c.cartTotalValue === 0 ? '0' : formatPrice(c.cartTotalValue)}</p>
      </>)}
    </div>
  )

  return (<>
    <EnhHeadingBlockComponent block={{blockType: 'enh-heading',
      specifiers: 'center',
      heading: { text: `FINALIZE PAYMENT` },
    } as EnhHeadingBlock}/>
    <div className='w-full flex gap-4 justify-center max-w-[35rem] h-[12rem] sm:h-[18rem] mx-auto'>
      <Button
        variant='outline'
        className={cn('w-full h-full text-lg sm:text-3xl text-wrap', paymentMethod === 'crypto' ? 'border-foreground border-4' : '')}
        onClick={() => setPaymentMethod('crypto')}
      >
        PAY WITH CRYPTO
      </Button>
      <Button
        variant='outline'
        className={cn('w-full h-full text-lg sm:text-3xl text-wrap', paymentMethod === 'bank' ? 'border-foreground border-4' : '')}
        onClick={() => setPaymentMethod('bank')}
      >
        BANK TRANSFER
      </Button>
    </div>
    {cart}
    <Button onClick={() => setStep(1)} disabled={!paymentMethod} className='mx-auto rounded-full w-full max-w-[15rem]'>Continue</Button>
  </>)
}

export default ChoosePaymentMethod