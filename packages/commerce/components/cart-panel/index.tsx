'use client'
import React, { type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../../service/context'
import { formatPrice } from '../../util'

import CartLineItem from './cart-line-item'
import { sendFBEvent, sendGAEvent } from '../../util/analytics'
import ProductsCarousel from './products-carousel'
import PromoCode from './promo-code'

const CartPanel: React.FC<PropsWithChildren & {
  className?: string
  isMobile?: boolean,
  showCarousel?: boolean
  showPromoCode?: boolean
  showShipping?: boolean
    /** if not provided, checkout button will not be shown */
  handleCheckout?: () => void
}> = observer(({
    /** Children is the heading area. */
  children,
  className='',
  isMobile=false,
  showCarousel=false,
  showPromoCode=false,
  showShipping=false,
  handleCheckout,
}) => {

  const cmmc = useCommerce()
  if (!cmmc) {
    return <div />
  }

  const _handleCheckout = () => {
    sendGAEvent('begin_checkout', {
      currency: 'USD',
      value: cmmc.cartTotal,
      items: cmmc.cartItems.map((item) => ({
        item_id: item.sku,
        item_name: item.title,
        item_category: item.categoryId,
        price: item.price,
        quantity: item.quantity
      })),
    })
    sendFBEvent('InitiateCheckout', {
      content_ids: cmmc.cartItems.map((item) => item.sku),
      contents: cmmc.cartItems.map(item => ({
        id: item.sku,
        quantity: item.quantity
      })),
      num_items: cmmc.cartItems.length,
      value: cmmc.cartTotal,
      currency: 'USD',
    })
    handleCheckout && handleCheckout()
  }

  return (
    <div className={cn('border p-4 rounded-lg', className)}>
      {children}
      {showCarousel && <ProductsCarousel items={cmmc.cartItems}/>}
      <div className='mt-2 w-full'>
        {cmmc.cartEmpty ? (
          <p className='text-center mt-4'>No items in cart</p>
        ) : (<>
          {cmmc.cartItems.map((item, i) => (
            <CartLineItem isMobile={isMobile} item={item} key={item.sku} className='mb-2 md:mb-3'/>
          ))}
          {showShipping && (
            <div className='flex flex-col gap-1 py-2 border-t'>
              <p className='flex justify-between'>
                <span className='text-muted-1'>Subtotal</span>
                <span className='font-semibold'>{cmmc.cartTotal === 0 ? '0' : formatPrice(cmmc.cartTotal)}</span>
              </p>
              <p className='flex justify-between'>
                <span className='text-muted-1'>Shipping</span>
                <span className='font-semibold'>Free</span>
              </p>
            </div>
          )}
          {showPromoCode && <PromoCode/>}
          <p className='border-t py-2 flex justify-between'>
            TOTAL
            <span className='font-semibold'>{cmmc.cartTotal === 0 ? '0' : formatPrice(cmmc.cartTotal)}</span>
          </p>
        </>
      )}
      </div>
      {handleCheckout && (<>
        {!cmmc.cartEmpty && (
          <Button 
            variant='primary' 
            rounded='lg' 
            className='mt-12 mx-auto w-full sm:max-w-[220px]' 
            onClick={_handleCheckout}
          >
            Checkout
          </Button>
        )}
      </>)}
    </div>
  )
})

export default CartPanel
