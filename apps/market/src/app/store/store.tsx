'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import { ProductCard, Cart, CategoryFacetsWidget } from '@hanzo/cart/components'
import { Icons } from '@hanzo/cart/components/Icons'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'
import { DrawerMenu } from '@hanzo/ui/common'
import { Button, Badge } from '@hanzo/ui/primitives'

// fixed top-[96px] w-full z-50 

const Store: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
  className?: string
  agent?: string
}> = observer(({
  className='',
  agent,
  searchParams={ ignore: undefined }
}) => {
  const c = useCommerce() 

  const mobile = (agent === 'phone')

  const cartColumnClx = 'min-w-[300px] md:min-w-[320px] lg:min-w-[320px] lg:max-w-[360px] xl:min-w-[360px]'

  const widgetClx = 'sticky z-30 bg-background top-[44px] md:top-[80px] mb-6 ' +
    'flex flex-row justify-between md:justify-start sm:gap-x-6 items-start pl-3 lg:pr-8 md:pr-14 py-3 ' + 
    'w-[100vw] sm:w-full left-0 right-0 h-auto ' 

  const facets1Clx = 'grid grid-cols-2 sm:gap-x-4 md:border-r ' + (mobile ? '' : 'pr-6 ')
  const facets2Clx = 'grid grid-cols-4 sm:gap-x-4 '

  return (
    <div className='flex flex-col justify-start items-start'>
      <CategoryFacetsWidget
        className={widgetClx} 
        isMobile={mobile}
        facetClassNames={[facets1Clx, facets2Clx]}
        facets={siteDef.ext.store.facets}
      >
        <DrawerMenu 
          className='md:hidden right-0 pr-3 text-primary relative' // ui has 'text-inherit', so need this for close buttons to appear.
          propogate={false}
          trigger={(
            <Button
              aria-label="Cart"
              variant="outline"
              size="icon"
              className="relative"
            >
            {c.cartItemCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -right-2 -top-2 g-6 w-6 h-6 font-sans text-xs rounded-full p-2"
              >
                {c.cartItemCount}
              </Badge>
            )}
              <Icons.shoppingCart className="h-4 w-4" aria-hidden="true" />
            </Button>            
          )}
          >
          <Cart isMobile={mobile} className='p-0 border-none mt-12'/>
        </DrawerMenu>
      </CategoryFacetsWidget>
    <div className={cn('flex flex-row justify-between gap-6 items-stretch w-[100vw] sm:w-auto overflow-y-scroll sm:overflow-y-hidden', className)}>
      <div className='flex flex-row px-4 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:grow'>
        {c.specifiedItems.map((item) => (<ProductCard item={item} key={item.product.sku} className='rounded-lg w-[40vw] sm:w-auto'/>))}
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
// lg:top-[94px] md:top-[94px] lg:top-0

export default Store
