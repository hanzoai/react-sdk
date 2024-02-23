'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../service'
import { formatPrice } from '../util'

import CartLineItem from './cart-line-item'


const Cart: React.FC<{
  className?: string
}> = observer(({
  className=''
}) => {

  const c = useCommerce()
  
  return (
    <div className={cn('border p-6 rounded-lg', className)}>
      <div className=''>
      {c.cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (<>
        {c.cartItems.map((item, i) => (<CartLineItem item={item} key={item.product.sku} className='mb-2'/>))}
        <p className='mt-6 text-right border-t pt-1'>TOTAL: {c.cartTotalValue === 0 ? '0' : formatPrice(c.cartTotalValue)}</p>
      </>)}
      </div>
      {c.cartItems.length > 0 && (
        <div>
          <Button size='lg' variant='secondary' rounded='lg' className='mt-12 mx-auto'>Checkout</Button>
        </div> 
      )}
    </div>
  )
})

export default Cart
