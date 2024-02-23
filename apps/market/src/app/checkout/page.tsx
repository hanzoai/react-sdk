'use client'

import React  from 'react'

import { Footer } from '@hanzo/ui/common'
import { Button, Input, Main } from '@hanzo/ui/primitives'

import siteDef from '../../siteDef'
import { useCommerce } from '@hanzo/cart/service'
import { ImageBlockComponent, type ImageBlock } from '@hanzo/ui/blocks'

const CheckoutPage = () => {
  const c = useCommerce()

  // TODO: show some info from the cart

  return (<>
    <Main className='md:flex-row gap-2 md:gap-4 flex justify-center'>
      <div className='flex flex-col gap-2'>
        <p>Deposit ${c.cartTotalValue} in Lux Coin (LUX on Lux Mainnet only) to:</p>
        <strong>0xAdf62DADB9E527fb06509842a4266919Fd85d214</strong>
        <p>Confirm your transaction hash:</p>
        <div className='flex gap-2'>
          <Input placeholder='0x...' />
          <Button onClick={() => console.log('Payment confirmed')}>Confirm</Button>
        </div>
      </div>
      <ImageBlockComponent block={{blockType: 'image', src: '/assets/img/payment-qr.png', dim: {h: 300, w: 300}, alt: 'payment QR code'} as ImageBlock}/>
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
  </>)
}

export default CheckoutPage
