'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'


import { ProductCard, Cart, CategoryFacetsWidget } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'

const Store: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
  className?: string
}> = observer(({
  className='',
  searchParams={ ignore: undefined }
}) => {
  const c = useCommerce() //min-w-[400px]
  return (
    <div className='flex flex-row justify-between gap-6 items-stretch '>
      <div className='grid grid-cols-4 gap-4 grow'>
        {c.specifiedItems.map((item) => (<ProductCard item={item} key={item.product.sku} className='rounded-lg'/>))}
      </div> 
      <div className='w-pr-20 '>
        <div className='fixed top-[96px] w-[400px] z-50 '>
          <CategoryFacetsWidget className='mb-6' facets={siteDef.ext.store.facets}/>
          <Cart className=''/>
        </div>
      </div>   
    </div>
  )
}) 

export default Store
