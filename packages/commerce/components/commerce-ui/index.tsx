'use client'
import React, { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {makeObservable, observable, action, reaction, computed} from 'mobx'
import { observer } from 'mobx-react-lite'

import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useCommerce, useCommerceUI } from '../../context'

import CommerceDrawer from './drawer'
import CarouselBuyCard from '../buy/carousel-buy-card'
import { TwoWayMap }  from '../../util'

class ObsMutator<T> {

  _s: T

  constructor(initial: T) {
    this._s = initial
    makeObservable(this, {
      _s: observable,
      set: action,
      value: computed
    })
  }

  set(v: T): void { this._s = v }
  get value(): T { return this._s }
}

type DrawerState =  'micro' | 'options' | 'closed'
const SNAP_POINTS = ['100px', 0.7]
const MAP = new TwoWayMap<DrawerState, string | number>(new Map<DrawerState, string | number>([
  ['micro', SNAP_POINTS[0]],
  ['options', SNAP_POINTS[1]]
]))

const CommerceUIComponent: React.FC = observer(() => {

  const stateRef = useRef<ObsMutator<DrawerState>>(
    new ObsMutator<DrawerState>('closed')
  )
  const shouldReactRef = useRef<boolean>(true)

  const ui = useCommerceUI()
  const cmmc = useCommerce()
  const router = useRouter()
  const isCheckout = usePathname() === '/checkout'

  useEffect(() => {
    return reaction(
      (): DrawerState  => {
        //console.log('DATA FN: ', isCheckout, ui.buyOptionsSkuPath, ui.recentSku)
        if (isCheckout) return 'closed'
        //if (ui.buyOptionsSkuPath) return 'options' 
        if (ui.recentSku) return 'micro'
        return 'closed'
      }, 
      (state) => {
        //console.log('REACTION FN: ', state)
        if (shouldReactRef.current) {
          stateRef.current.set(state)
        }
        shouldReactRef.current = true
      }
    )
  }, [isCheckout])


  const setSnap = (v: string | number | null): void => {
    const state = v ? MAP.revGet(v as string)! : 'closed'

//    console.log('SETSNAP FN: ', v, state)
/*
    if (state === 'options') {
      if (ui.recentSku) {
        shouldReactRef.current = false
        ui.showBuyOptions(ui.recentSku)
      }
      else {
        console.log("DRAWER BEING PULLING OPEN, BUT NO RECENT SKU!")
      }
    }
    else if (state === 'micro') {
      shouldReactRef.current = false
      ui.hideBuyOptions()
    }
    else {
      if (ui.recentSku) {
        shouldReactRef.current = false
        ui.removeRecentSku(ui.recentSku)  // FOR NOW
      }
      else {
        console.log("DRAWER BEING PULLING CLOSED, BUT NO RECENT SKU!")
      }
    }
  */
    stateRef.current.set(state)
  }

  const handleCheckout = () => {router.push('/checkout')}

    // Should only ever be called to close
  const reallyOnlyCloseDrawer = (b: boolean) => {
    if (!b ) {
      if (stateRef.current.value === 'options') {
        stateRef.current.set('micro')
      }
      else {
        stateRef.current.set('closed')
      }
    }
  }

  //console.log("RENDERING... ", stateRef.current.value, MAP.get(stateRef.current.value))

  return (<>
    <CommerceDrawer 
      open={stateRef.current.value !== 'closed'} 
      setOpen={reallyOnlyCloseDrawer}
      modal={stateRef.current.value !== 'micro'}
      snapPoints={SNAP_POINTS}
      activeSnapPoint={stateRef.current.value === 'closed' ? SNAP_POINTS[0] : MAP.get(stateRef.current.value)}
      setActiveSnapPoint={setSnap}
      drawerClx={'w-full md:max-w-[550px] md:mx-auto lg:max-w-[50vw]'}
    >
      <AnimatePresence>
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
      {stateRef.current.value === 'options' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        >
          <CarouselBuyCard 
            skuPath={ui.recentSku ?? ''} 
            handleCheckout={handleCheckout} 
            clx='w-full'
            buttonClx='w-full min-w-[160px] sm:max-w-[320px]' 
            selectorClx='max-w-[475px]'
          />
        </motion.div>
      )}
      </AnimatePresence>
    </CommerceDrawer>
    {stateRef.current.value === 'closed' && !cmmc.cartEmpty && !isCheckout && (
      <Button onClick={handleCheckout} variant='primary' rounded='lg' className='w-[160px] absolute bottom-[20px]' style={{right: '60px'}}>
        {`Checkout (${cmmc.cartQuantity})`}
      </Button>
    )}
  </>)
})

export default CommerceUIComponent
