'use client'
import React, { useEffect, useState, type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'

import { 
  useQueryState, 
} from 'next-usequerystate'

import { cn } from '@hanzo/ui/util'
import { ProductCard, Cart, CategoryFacetsWidget, CategoryCard } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'
import CartDrawer from '@/components/cart-drawer'
import type { LineItem } from '@hanzo/cart/types'

const ProductViewStore: React.FC<{
  className?: string
  agent?: string
}> = observer(({
  className='',
  agent,
}) => {
  const c = useCommerce() 

  const mobile = (agent === 'phone')

  const [loading, setLoading] = useState<boolean>(true)
  const [c1, setC1] = useQueryState('c1') // actually level 2 in our data (AG / AU)
  const [c2, setC2] = useQueryState('c2') // actually level 3 in our data (B / C / MB / GD)
  
  //const [size, setSize] = useQueryState('size') // eg, '1-OZ'
  const [items, setItems] = useState<LineItem[] | undefined>(undefined)

  useEffect(() => {
    const catsToSpecify: string[] = []
    if (c1) {
      catsToSpecify.push(c1)
    }
    if (c2) {
      catsToSpecify.push(c2)
    }
    const items_ = c.setSpecifiedCategories(catsToSpecify)
    setItems(items_)
    setLoading(false)
  }, [c1 , c2])


  const Facets: React.FC<PropsWithChildren & {className?: string}> = ({
    children,
    className=''
  }) => {
          /*'top-[44px] md:top-[80px] mb-6 ' + */
    const widgetClx = 'flex flex-row justify-between sm:gap-x-6 items-start'  
    const facets1Clx = 'grid grid-cols-2 gap-0 ' + (mobile ? '' : 'pr-6 ')
    const facets2Clx = 'grid grid-cols-4 gap-0 '
    return (
      <CategoryFacetsWidget
        className={cn(widgetClx, className)} 
        isMobile={mobile}
        facetClassNames={[facets1Clx, facets2Clx]}
        mutators={[{val: c1, set: setC1} , {val: c2, set: setC2}]}
        facets={siteDef.ext.store.facets}
      >
        {children}
      </CategoryFacetsWidget>
    )
  }
  const StoreCart: React.FC<{className?: string}> = ({
    className=''
  }) => {
    return (
      <Cart isMobile={mobile} className={className}>
        <h4 className='text-center font-heading text-xl'>Lux Market Cart</h4>
      </Cart>
    )
  }

  const Stage: React.FC<{className?: string}> = ({
    className=''
  }) => {
    return (
      <div id='SCV_STAGE' className={className}>
        {!loading ? (<CategoryCard className=''/>) : <h6>Loading item...</h6> } 
      </div>
    )
  }

//  {!loading ? (<Facets />) : ( <div className='h-[50px] w-pr-60 bg-level-1'/>)}

const cartColumnClx = 'hidden md:block min-w-[300px] md:min-w-[320px] lg:min-w-[320px] lg:max-w-[360px] xl:min-w-[360px]'

//sticky z-30
  return (
    <div id='SCV_OUTERMOST' className={cn('flex flex-col justify-start items-stretch relative', className)} >
      <div id='SCV_FACET_CONTAINER_COMPACT' className='pb-6 xl:hidden bg-background w-full '>
        <Facets className=' bg-background w-full' >
          <CartDrawer className='md:hidden pr-3 text-primary relative' >
            <Cart isMobile={mobile} className='p-0 border-none mt-12'/>
          </CartDrawer>
        </Facets>   
      </div>
      <div id='SCV_COL_CONTAINER' className={cn('flex flex-row justify-start gap-6 items-start relative')}>
        <div id='SCV_STAGE_COL' className='grow flex flex-col h-full relative'>
          <div id='SCV_FACET_CONTAINER_BIG' className=' bg-background pb-2 sticky top-[80px] z-30 hidden xl:flex flex-col justify-start mb-6'>
            <Facets className=' bg-background ' />   
          </div>
          <Stage />
        </div>
        <div id='SCV_CART_COLUMN' className={cartColumnClx}>
          <StoreCart className='sticky z-30 top-[80px]' />
        </div>
      </div> 
    </div>
  )
}) 

/*
        <div className={'fixed z-50 md:top-[94px] lg:top-auto xl:top-[94px] ' + cartColumnClx}>
          <Cart className=''/>
        </div>


        <CartDrawer className='md:hidden right-0 pr-3 text-primary relative' >
          <Cart isMobile={mobile} className='p-0 border-none mt-12'/>
        </CartDrawer>



      <div className='flex flex-row px-4 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:grow'>
     
          <CategoryCard className=''/>
          items?.map((item) => (
            // <ProductCard item={item} key={item.product.sku} className='rounded-lg w-[40vw] sm:w-auto'/>
            <h6 key={item.product.sku} >{item.product.sku}:<br />{item.product.title}</h6>
          ))
        ) : (
          <h3>loading...</h3>
       
*/

export default ProductViewStore
