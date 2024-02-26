'use client'

import { useState }  from 'react'
import { Copy } from 'lucide-react'

import { Footer } from '@hanzo/ui/common'
import { Button, Input, Main, toast } from '@hanzo/ui/primitives'

import { useCommerce } from '@hanzo/cart/service'
import { type ImageBlock, type EnhHeadingBlock, EnhHeadingBlockComponent, ImageBlockComponent } from '@hanzo/ui/blocks'
import { formatPrice } from '@hanzo/cart/util'
import { cn } from '@hanzo/ui/util'
import CartLineItem from '../store/cart-line-item'
import siteDef from '../../siteDef'

const CheckoutPage = () => {
  const c = useCommerce()
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank'>()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({title: 'Copied to clipboard!'})
  }

  return (<>
    <Main className='gap-8 md:gap-14 flex flex-col justify-center'>
      <EnhHeadingBlockComponent block={{blockType: 'enh-heading',
        specifiers: 'center',
        heading: { text: `FINALIZE PAYMENT` },
      } as EnhHeadingBlock}/>
      <div className='w-full flex gap-4 justify-center max-w-[50rem] h-[15rem] sm:h-[25rem] mx-auto'>
        <Button
          variant='outline'
          className={cn('w-full h-full text-lg sm:text-4xl text-wrap', paymentMethod === 'crypto' ? 'border-foreground border-2' : '')}
          onClick={() => setPaymentMethod('crypto')}
        >
          PAY WITH CRYPTO
        </Button>
        <Button
          variant='outline'
          className={cn('w-full h-full text-lg sm:text-4xl text-wrap', paymentMethod === 'bank' ? 'border-foreground border-2' : '')}
          onClick={() => setPaymentMethod('bank')}
        >
          BANK TRANSFER
        </Button>
      </div>
      <div className='border p-6 rounded-lg w-full max-w-[70rem] mx-auto'>
        {c.cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (<>
          {c.cartItems.map((item, i) => (<CartLineItem item={item} key={item.product.sku} className='mb-2'/>))}
          <p className='mt-6 text-right border-t pt-1'>TOTAL: {c.cartTotalValue === 0 ? '0' : formatPrice(c.cartTotalValue)}</p>
        </>)}
      </div>
      {paymentMethod === 'crypto' ? (
        <div className='flex flex-col sm:flex-row gap-10 max-w-[70rem] mx-auto'>
          <div className='flex flex-col gap-6 w-full'>
            <EnhHeadingBlockComponent block={{blockType: 'enh-heading',
              specifiers: 'preheading-heading-font',
              preheading: { text: 'Scan QR code to login to your wallet and complete the secure transaction.', level: 5, mb: 8 },
              heading: { text: `Deposit ${formatPrice(c.cartTotalValue)} in Lux Coin (LUX on Lux Mainnet only) to:`, level: 6, mb: 4 },
              byline: { text: '0xAdf62DADB9E527fb06509842a4266919Fd85d214', level: 6 },
            } as EnhHeadingBlock}/>
            <div className='flex gap-2 w-full'>
              <Input placeholder='0x...' />
              <Button onClick={() => console.log('Payment confirmed')}>Confirm</Button>
            </div>
          </div>
          <ImageBlockComponent block={{blockType: 'image',
            src: '/assets/img/payment-qr.png',
            dim: {h: 300, w: 300},
            alt: 'payment QR code'
          } as ImageBlock} className='m-auto'/>
        </div>
      ) : paymentMethod === 'bank' ? (
        <div className='flex flex-col gap-4 w-full max-w-[40rem] mx-auto'>
          <EnhHeadingBlockComponent block={{blockType: 'enh-heading',
            heading: { text: `WIRE INFO`, level: 2 },
          } as EnhHeadingBlock}/>
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex flex-col gap-1'>
              <p className='text-xs'>Bank Name</p>
              <div className='flex items-center justify-between text-lg border rounded-lg p-2'>
                Bank of America
                <Button variant='ghost' size='icon' onClick={() => copyToClipboard('Bank of America')}>
                  <Copy className='h-4 w-4'/>
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-xs'>Account Name</p>
              <div className='flex items-center justify-between text-lg border rounded-lg p-2'>
                Lux Partners, LLC
                <Button variant='ghost' size='icon' onClick={() => copyToClipboard('Lux Partners, LLC')}>
                  <Copy className='h-4 w-4'/>
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-xs'>Account Number</p>
              <div className='flex items-center justify-between text-lg border rounded-lg p-2'>
                9034425684
                <Button variant='ghost' size='icon' onClick={() => copyToClipboard('9034425684')}>
                  <Copy className='h-4 w-4'/>
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-xs'>ABA Number</p>
              <div className='flex items-center justify-between text-lg border rounded-lg p-2'>
                74743826
                <Button variant='ghost' size='icon' onClick={() => copyToClipboard('74743826')}>
                  <Copy className='h-4 w-4'/>
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-xs'>Bank Address</p>
              <div className='flex items-center justify-between text-lg border rounded-lg p-2'>
                <div>
                  Bank of America<br />
                  13 W Bowery Street<br />
                  New York, New York 32456 USA
                </div>
                <Button variant='ghost' size='icon' onClick={() => copyToClipboard('Bank of America\n13 W Bowery Street\nNew York, New York 32456 USA')}>
                  <Copy className='h-4 w-4'/>
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-xs'>SWIFT Code</p>
              <div className='flex items-center justify-between text-lg border rounded-lg p-2'>
                BOAIUS6S
                <Button variant='ghost' size='icon' onClick={() => copyToClipboard('BOAIUS6S')}>
                  <Copy className='h-4 w-4'/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
  </>)
}

export default CheckoutPage
