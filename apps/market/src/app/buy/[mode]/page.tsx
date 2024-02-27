'use client'
import React, { useEffect, useState, type PropsWithChildren, useRef } from 'react'
import { observer } from 'mobx-react-lite'

import { useQueryState } from 'next-usequerystate'

import { cn } from '@hanzo/ui/util'
import { Cart, FacetsWidget, CategoryView } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'
import CartDrawer from '@/components/cart-drawer'
import type { Category, FacetsSelection } from '@hanzo/cart/types'
import Link from 'next/link'
import { Skeleton } from '@hanzo/ui/primitives'

type Props = {
  params: { mode: 'cat' | 'prod' }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const BuyPage: React.FC<Props> = observer(({
  params,
  searchParams
}) => {

  const agent = searchParams?.agent as string
  const mode = params.mode
  const mobile = (agent === 'phone')

  const c = useCommerce() 

  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')
  const [level1, setLevel1] = useQueryState('level1') // level 1 facet value (AG / AU)
  
  const [level2, setLevel2] = useQueryState('level2') // level 2 facet value (B / C / MB / GD)

  const categoryRef = useRef<Category | undefined>(undefined)

  useEffect(() => {
    setMessage('')
    const facets: FacetsSelection = { }
    if (level1) {
      facets[1] = [level1]
    }
    if (level2) {
      facets[2] = [level2]
    }
    if (level1 && level2) {
      const categories = c.setFacetsSelection(facets)
      if (categories.length > 1) {
        console.log("CAT", categories.map((c) => (c.title)))
        throw new Error (
  
          "CategoryContents: More than one specified Category should never be possible with this UI!"
        )
      }
      categoryRef.current = categories[0] 
    }
    else {
      setMessage('Please select an option from each group above.')
    }
    setLoading(false)

  }, [level1 , level2])

  const Facets: React.FC<PropsWithChildren & {className?: string}> = ({
    children,
    className=''
  }) => {

    const widgetClx = 'flex flex-row justify-between sm:gap-x-6 xs:gap-x-2 items-start'  
    const facets1Clx = 'grid grid-cols-2 gap-0 ' + (mobile ? '' : 'pr-6 ')
    const facets2Clx = 'grid grid-cols-4 gap-0 '

    return !loading ? (
      <FacetsWidget
          // using neg margin to compensate for fw putting extra rt padding on shopping cart button
        className={cn(widgetClx, (mobile ? 'relative left-0 -mr-3':''), className)} 
        exclusive
        isMobile={mobile}
        facetClassNames={[facets1Clx, facets2Clx]}
        mutators={[{val: level1, set: setLevel1} , {val: level2, set: setLevel2}]}
        facets={siteDef.ext.commerce.facets}
      >
        {children}
      </FacetsWidget>
    ) : (
      <Skeleton className={'h-12 ' + className} />
    )
  }
  
  const StoreCart: React.FC<{className?: string}> = ({
    className=''
  }) => {
    return !loading ? (
      <Cart isMobile={mobile} className={className}>
        <h4 className='text-center font-heading text-xl'>Lux Market Cart</h4>
      </Cart>
    ) : (
      <div className={cn('h-40 bg-level-1 rounded-xl' , className)}/>
    )
  }

  const Stage: React.FC<{className?: string}> = ({
    className=''
  }) => {
    return (
      <div /* id='SCV_STAGE' */ className={className}>
      {message ? (
        <div className={cn('typography lg:min-w-[400px] lg:max-w-[600px] overflow-hidden bg-level-1 h-[50vh] rounded-xl p-6', className)} >
          <h5 className='text-accent text-center'>{message}</h5>
          <h6 className='text-accent text-center'>Or, would you like to try a<br/><Link className='text-xl font-semibold ' href='/buy'>more general search</Link>?</h6>
        </div>
      ) : (
        <CategoryView className='' agent={agent} category={categoryRef.current!}/>
      )} 
      </div>
    )
  }

  const cartColumnClx = 'hidden md:block min-w-[300px] md:min-w-[320px] ' +
    'lg:min-w-[320px] lg:max-w-[360px] xl:min-w-[360px]'

  return mobile ? (
    <div /* id='SCV_OUTERMOST' */ className='flex flex-col justify-start items-stretch relative w-full' >
      <div /* id='SCV_FACET_CONTAINER_COMPACT' */ className='py-2 bg-background w-full sticky top-[44px]'>
        <Facets className='sm:w-full ' >
          <CartDrawer isMobile={true} className='md:hidden pr-1 text-primary relative' buttonClassName='h-9' >
            <Cart isMobile={true} className='p-0 border-none mt-12'/>
          </CartDrawer>
        </Facets>   
      </div>
      <Stage />
    </div>
  ) : (
    <div /* id='SCV_OUTERMOST' */ className='flex flex-col justify-start items-stretch relative w-full' >
      <div /* id='SCV_FACET_CONTAINER_COMPACT' */ className='xl:hidden py-2 bg-background w-full sticky top-[80px] sm:top-[44px] z-40 '>
        <Facets className='sm:w-full' >
          <CartDrawer className='md:hidden pr-1 text-primary relative' buttonClassName='h-9' >
            <Cart isMobile={mobile} className='p-0 border-none mt-12'/>
          </CartDrawer>
        </Facets>   
      </div>
      <div /* id='SCV_COL_CONTAINER' */ className='flex flex-row justify-start gap-6 items-stretch relative h-full pt-3'>
        <div /* id='SCV_STAGE_COL' */ className='grow flex flex-col h-full relative'>
          <div /* id='SCV_FACET_CONTAINER_BIG' */ className='sticky top-[80px] z-30 bg-background pb-2 hidden xl:flex flex-col justify-start mb-6'>
            <Facets className='' />   
          </div>
          <Stage />
        </div>
        <div /* id='SCV_CART_COLUMN' */ className={cn('z-30',  cartColumnClx)}>
          <StoreCart className='sticky z-30 top-[146px] xl:top-[80px]' />
        </div>
      </div> 
    </div>
  )
}) 

export default BuyPage
