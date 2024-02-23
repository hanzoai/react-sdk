'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { ProductCard } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'
import { formatPrice } from '@hanzo/cart/util'

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

const Store: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
  className?: string
}> = observer(({
  className='',
  searchParams={ ignore: undefined }
}) => {
  const c = useCommerce()
  return (
    <div className='flex flex-row justify-between gap-6 items-start'>
      <div className='grid grid-cols-4 gap-4'>
        {c.specifiedItems.map((item) => (<ProductCard item={item} key={item.product.sku} className='rounded-lg'/>))}
      </div>    
      <Cart className='min-w-[400px] w-pr-20 md:w-pr-15'/>
    </div>
  )
}) 

export default Store
