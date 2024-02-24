'use client'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { 
  useQueryState, 
} from 'next-usequerystate'

import { cn } from '@hanzo/ui/util'
import { ProductCard, Cart, CategoryFacetsWidget } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'
import CartDrawer from '@/components/cart-drawer'

const ProductViewStore: React.FC<{
  className?: string
  agent?: string
  //searchParams?: { [key: string]: string | string[] | undefined }
}> = observer(({
  className='',
  agent,
  //searchParams
}) => {
  const c = useCommerce() 

  const mobile = (agent === 'phone')

  //const [loading, setLoading] = useState<boolean>(true)
  const [c1, setC1] = useQueryState('c1') // actually level 2 in our data
  const [c2, setC2] = useQueryState('c2') // actually level 3 in our data
  //const [size, setSize] = useQueryState('size') // eg, '1-OZ'


  const sync = () => {
    const catsToSpecify: string[] = []
    if (c1) {
      catsToSpecify.push(c1)
    }
    if (c2) {
      catsToSpecify.push(c2)
    }
    c.setSpecifiedCategories(catsToSpecify)
  }

  useEffect(() => {
    sync()
  
  }, [c1, c2])

  const cartColumnClx = 'min-w-[300px] md:min-w-[320px] lg:min-w-[320px] lg:max-w-[360px] xl:min-w-[360px]'

  const widgetClx = 'sticky z-30 bg-background top-[44px] md:top-[80px] mb-6 ' +
    'flex flex-row justify-between md:justify-start sm:gap-x-6 items-start pl-3 lg:pr-8 md:pr-14 py-3 ' + 
    'w-[100vw] sm:w-full left-0 right-0 h-auto ' 

  const facets1Clx = 'grid grid-cols-2 md:border-r gap-0 ' + (mobile ? '' : 'pr-6 ')
  const facets2Clx = 'grid grid-cols-4 gap-0 '

  return (
    <div className='flex flex-col justify-start items-start'>
      <CategoryFacetsWidget
        className={widgetClx} 
        isMobile={mobile}
        facetClassNames={[facets1Clx, facets2Clx]}
        mutators={[{val: c1, set: setC1} , {val: c2, set: setC2}]}
        facets={siteDef.ext.store.facets}
      >
        <CartDrawer className='md:hidden right-0 pr-3 text-primary relative' >
          <Cart isMobile={mobile} className='p-0 border-none mt-12'/>
        </CartDrawer>
      </CategoryFacetsWidget>
    <div className={cn('flex flex-row justify-between gap-6 items-stretch w-[100vw] sm:w-auto overflow-y-scroll sm:overflow-y-hidden', className)}>
      <div className='flex flex-row px-4 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:grow'>
        { true ? (
          c.specifiedItems.map((item) => (
            // <ProductCard item={item} key={item.product.sku} className='rounded-lg w-[40vw] sm:w-auto'/>
            <h6 key={item.product.sku} >{item.product.sku}:<br />{item.product.title}</h6>
          ))
        ) : (
          <h3>loading...</h3>
        )}
      </div> 
      <div className={'shrink hidden md:block ' + cartColumnClx}>
        <div className={'fixed z-50 md:top-[94px] lg:top-auto ' + cartColumnClx}>
          <Cart className=''/>
        </div>
      </div>   
    </div>
    </div>
  )
}) 

export default ProductViewStore
