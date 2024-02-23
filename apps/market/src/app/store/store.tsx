'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import { ProductCard } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'
import { formatPrice } from '@hanzo/cart/util'


const CartComp: React.FC<{
  className?: string
}> = observer(({
  className=''
}) => {

  const c = useCommerce()
  
  return (
    <div className={cn('min-w-[300px] border p-6 ', className)}>
      <div className=''>


      </div>
      <p>Items in cart: {c.cartItemCount}</p>
      <p>TOTAL: {c.cartTotalValue === 0 ? '0' : formatPrice(c.cartTotalValue)}</p>
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
    <div className='flex flex-row justify-between gap-8 items-start'>
      <div className='grid grid-cols-4 gap-4'>
        {c.specifiedItems.map((item) => (<ProductCard item={item} key={item.product.sku}/>))}
      </div>    
      <CartComp />
    </div>
  )
}) 

export default Store
