'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { observer } from 'mobx-react-lite'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { ProductCard } from '@hanzo/cart/components'
import { persistCart, useCommerce } from '@hanzo/cart/service'
import { formatPrice } from '@hanzo/cart/util'

import CartLineItem from './cart-line-item'
import { useCurrentUser } from '@hanzo/auth'

const Cart: React.FC<{
  className?: string
}> = observer(({
  className=''
}) => {
  const router = useRouter()
  const [loadingCheckout, setLoadingCheckout] = React.useState(false)
  const c = useCommerce()
  const {user} = useCurrentUser()

  const checkout = async () => {
    setLoadingCheckout(true)
    if (user?.email) {
      await persistCart(c.cartItems, user?.email)
    }
    router.push('/checkout')
  }
  
  return (
    <div className={cn('border p-6 rounded-lg', className)}>
      {!user ? (
        <div>
          <p>You need to login before you can start adding items to your cart.</p>
          <Button size='lg' variant='secondary' rounded='lg' className='mt-12 mx-auto' onClick={() => router.push('/login')}>Login</Button>
        </div>
      ) : (
        <>
          <div className=''>
            {c.cartItems.length === 0 ? (
              <p>No items in cart</p>
            ) : (<>
              {c.cartItems.map((item, i) => (<CartLineItem item={item} key={item.product.sku} className='mb-2'/>))}
              <p className='mt-6 text-right border-t pt-1'>TOTAL: {c.cartTotalValue === 0 ? '0' : formatPrice(c.cartTotalValue)}</p>
            </>)}
          </div>
          {c.cartItems.length > 0 && (
            <Button size='lg' variant='secondary' rounded='lg' className='mt-12 mx-auto' onClick={checkout} disabled={loadingCheckout}>Checkout</Button>
          )}
        </>
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
  const {user} = useCurrentUser()

  return (
    <div className='flex flex-row justify-between gap-6 items-start'>
      <div className='grid grid-cols-4 gap-4'>
        {c.specifiedItems.map((item) => (<ProductCard item={item} key={item.product.sku} className='rounded-lg' loggedIn={!!user}/>))}
      </div>    
      <Cart className='min-w-[400px] w-pr-20 md:w-pr-15'/>
    </div>
  )
}) 

export default Store
