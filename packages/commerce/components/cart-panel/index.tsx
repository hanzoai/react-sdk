'use client'
import React, { type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'

import { Button, ScrollArea } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../../service/context'
import { formatPrice } from '../../util'
import { sendFBEvent, sendGAEvent } from '../../util/analytics'

import CartLineItem from './cart-line-item'
import PromoCode from './promo-code'

const CartPanel: React.FC<PropsWithChildren & {
    /** fix size and scroll after 'scrollAfter items in teh cart. */
  scrollAfter?: number
  scrollHeightClx?: string
  imgSizePx?: number
  className?: string
  itemClx?: string
  listClx?: string
  noItemsClx?: string
  totalClx?: string
  buttonClx?: string
  showPromoCode?: boolean
  showShipping?: boolean
    /** if not provided, 'checkout' button will be rendered */
  handleCheckout?: () => void
}> = observer(({
    /** If provided, 'children' is rendered above the items. eg, a heading. */
  children,
  scrollAfter=5,
  scrollHeightClx='h-[70vh]',
  imgSizePx=40,
  className='',
  itemClx='',
  listClx='',
  noItemsClx='',
  totalClx='',
  buttonClx='',
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

  const Main: React.FC = () => (<>
    {cmmc.cartEmpty ? (
      <p className={cn('text-center mt-4', noItemsClx)}>No items in cart</p>
    ) : (<>
    {cmmc.cartItems.map((item) => (
      <CartLineItem imgSizePx={imgSizePx} item={item} key={`mobile-${item.sku}`} className={cn('mb-2', itemClx)}/>
    ))}
    </>)}
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
  </>)

  const scrolling = (): boolean => (cmmc.cartItems.length > scrollAfter)

  return (
    <div className={cn('border p-4 rounded-lg flex flex-col', className, scrolling() ? scrollHeightClx : 'h-auto')}>
      {children}
      {scrolling() ? (
        <ScrollArea className={cn('mt-2 w-full shrink py-0', listClx)}>
          <Main />
        </ScrollArea>
      ) : (
        <div className={cn('mt-2 w-full', listClx)}>
          <Main />
        </div>
      )}
      {handleCheckout && !cmmc.cartEmpty && (
        <Button 
          onClick={_handleCheckout} 
          variant='primary' 
          rounded='lg' 
          className={cn('mt-12 mx-auto w-full sm:max-w-[220px]', buttonClx)} 
        >
          Checkout
        </Button>
      )}
    </div>
  )
})

export default CartPanel
