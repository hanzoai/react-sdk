'use client'
import React, { type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../../service/context'
import { formatPrice } from '../../util'
import { sendFBEvent, sendGAEvent } from '../../util/analytics'

import CartLineItem from './cart-line-item'

const CartPanel: React.FC<PropsWithChildren & {
  className?: string
    /** if not provided, 'checkout' button will be rendered */
  handleCheckout?: () => void
}> = observer(({
    /** If provided, 'children' is rendered above the items. eg, a heading. */
  children,
  className='',
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
      <div className='mt-2 w-full'>
      {cmmc.cartEmpty ? (
        <p className='text-center mt-4'>No items in cart</p>
      ) : (<>
        {cmmc.cartItems.map((item) => (<>
          <CartLineItem imgSizePx={26} item={item} key={`mobile-${item.sku}`} className='md:hidden mb-2'/>
          <CartLineItem imgSizePx={40} item={item} key={`non-mobile-${item.sku}`} className='hidden md:flex mb-3'/>
        </>))}
        <p className='mt-6 text-right border-t pt-1'>TOTAL: <span className='font-semibold'>{cmmc.cartTotal === 0 ? '0' : formatPrice(cmmc.cartTotal)}</span></p>
      </>)}
      </div>
      {handleCheckout && !cmmc.cartEmpty && (
        <Button onClick={_handleCheckout} variant='primary' rounded='lg' className='mt-12 mx-auto w-full sm:max-w-[220px]' >
          Checkout
        </Button>
      )}
    </div>
  )
})

export default CartPanel
