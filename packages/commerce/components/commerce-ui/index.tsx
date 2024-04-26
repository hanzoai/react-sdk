'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
//import {makeObservable, observable, action, reaction, computed, type IObservableValue} from 'mobx'
import { observer } from 'mobx-react-lite'

//import { motion, AnimatePresence } from 'framer-motion'

//import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce, useCommerceUI } from '../../context'

import CommerceDrawer from './drawer'
import CarouselBuyCard from '../buy/carousel-buy-card'

//const foo = observable.box(true)

const CommerceUIComponent: React.FC = observer(() => {

//  const drawerOpenRef = useRef<IObservableValue<boolean>>(observable.box(false))

  const ui = useCommerceUI()
  const cmmc = useCommerce()
  const router = useRouter()
  const isCheckout = usePathname() === '/checkout'

  const handleCheckout = () => {router.push('/checkout')}

    // Should only ever be called to close
  const reallyOnlyCloseDrawer = (b: boolean) => {
    if (!b ) {
      ui.hideBuyOptions()
    }
  }

  return (<>
    <CommerceDrawer 
      open={!!ui.buyOptionsSkuPath} 
      setOpen={reallyOnlyCloseDrawer}
      modal={true}
      drawerClx={'w-full md:max-w-[550px] md:mx-auto lg:max-w-[50vw]'}
    >
      <CarouselBuyCard 
        skuPath={ui.buyOptionsSkuPath!} 
        handleCheckout={handleCheckout} 
        clx='w-full'
        buttonClx='w-full min-w-[160px] sm:max-w-[320px]' 
        selectorClx='max-w-[475px]'
      />
    </CommerceDrawer>
  </>)
})

export default CommerceUIComponent


/*
    {stateRef.current.value === 'closed' && !cmmc.cartEmpty && !isCheckout && (
      <Button onClick={handleCheckout} variant='primary' rounded='lg' className='w-[160px] absolute bottom-[20px]' style={{right: '60px'}}>
        {`Checkout (${cmmc.cartQuantity})`}
      </Button>
    )}

//       <AnimatePresence>


      {stateRef.current.value === 'micro' && (<>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeOut", duration: 0.3 }}
          className='w-full flex flex-col items-center'
        >
          <p>recently add: {ui.recentSku}</p>
          <Button 
            onClick={handleCheckout} 
            variant='primary' 
            rounded='lg' 
            className='w-full min-w-[160px] sm:max-w-[320px]' 
          >
            {`Checkout (${cmmc.cartQuantity})`}
          </Button>
        </motion.div>
      </>)}


*/