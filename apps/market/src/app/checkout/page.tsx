'use client'

import React  from 'react'

import { Footer } from '@hanzo/ui/common'
import { Button, Input, Main } from '@hanzo/ui/primitives'

import siteDef from '../../siteDef'
import { useCommerce } from '@hanzo/cart/service'
import { type ImageBlock, type EnhHeadingBlock, type ElementBlock, type ScreenfulBlock } from '@hanzo/ui/blocks'
import { ScreenfulBlockComponent as Screenful } from '@hanzo/ui/blocks'

const CheckoutPage = () => {
  const c = useCommerce()

  // TODO: show some info from the cart

  return (<>
    <Main className='md:flex-row gap-2 md:gap-4 flex justify-center'>
      <Screenful 
        block={{blockType: 'screenful', contentColumns: [[
          {blockType: 'enh-heading',
            specifiers: 'preheading-heading-font',
            preheading: { text: 'Complete your order', level: 3, mb: 6 },
            heading: { text: `Deposit $${c.cartTotalValue} in Lux Coin (LUX on Lux Mainnet only) to:`, level: 6, mb: 0 },
            byline: { text: 'Confirm your transaction hash:', level: 6 },
          } as EnhHeadingBlock,
          {blockType: 'element', element: <div className='flex gap-2 w-full'>
            <Input placeholder='0x...' />
            <Button onClick={() => console.log('Payment confirmed')}>Confirm</Button>
          </div>} as ElementBlock,
          ],
          [{blockType: 'image',
            src: '/assets/img/payment-qr.png',
            dim: {h: 300, w: 300},
            alt: 'payment QR code'
          } as ImageBlock
        ]]} as ScreenfulBlock}
      />
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
  </>)
}

export default CheckoutPage
