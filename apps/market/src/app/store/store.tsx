'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import { ProductCard, Cart, CategoryFacetsWidget } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'

// fixed top-[96px] w-full z-50 

const Store: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
  className?: string
}> = observer(({
  className='',
  searchParams={ ignore: undefined }
}) => {
  const c = useCommerce() 
  const cartColumnClx = 'min-w-[300px] md:min-w-[320px] lg:min-w-[320px] lg:max-w-[360px] xl:min-w-[360px]'
  return (
    <div className='flex flex-col justify-start items-start'>
      <CategoryFacetsWidget 
        className='sticky z-30 bg-background top-[80px] mb-6 flex flex-row gap-x-6 items-start pl-3 lg:pr-8 md:pr-14 py-3' 
        facetClassNames={[
          'grid grid-cols-2 gap-x-4 border-r pr-6 ', 
          'grid grid-cols-4 gap-x-4 '
        ]} 
        facets={siteDef.ext.store.facets}
      />
    <div className={cn('flex flex-row justify-between gap-6 items-stretch', className)}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grow'>
        {c.specifiedItems.map((item) => (<ProductCard item={item} key={item.product.sku} className='rounded-lg'/>))}
      </div> 
      <div className={'shrink ' + cartColumnClx}>
        <div className={'fixed z-50 md:top-[94px] lg:top-auto ' + cartColumnClx}>
          <Cart className=''/>
        </div>
      </div>   
    </div>

    </div>
  )
}) 
// lg:top-[94px] md:top-[94px] lg:top-0

export default Store
