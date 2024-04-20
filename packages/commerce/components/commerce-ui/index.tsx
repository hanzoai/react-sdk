'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
 
import { useCommerceUI } from '../../context'

import CommerceDrawer from './drawer'
import CarouselBuyCard from '../buy/carousel-buy-card'

const CommerceUIComponent: React.FC<{}> = ({

}) => {
  
  const ui = useCommerceUI()
  const router = useRouter()
  
  const handleCheckout = () => {router.push('/checkout')}

    // Should only ever be called to close
  const openDrawer = (b: boolean) => {
    if (!b) {
      ui.hideBuyOptions()
    }
  }

  return (
    <CommerceDrawer open={ui.buyOptionsShowing} setOpen={openDrawer}>
      <CarouselBuyCard 
        skuPath={ui.skuPath ?? ''} 
        handleCheckout={handleCheckout} 
        clx='w-full'
      />
    </CommerceDrawer>
  )
}

export default CommerceUIComponent
