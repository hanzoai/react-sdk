'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'


import { ProductCard } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'


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
