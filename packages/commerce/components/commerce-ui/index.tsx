'use client'
import React, { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {makeObservable, observable, action, reaction, computed} from 'mobx'
import { observer } from 'mobx-react-lite'

//import { motion, AnimatePresence } from 'framer-motion'

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

type DrawerState = 'closed' | 'micro' | 'options'
const SNAP_POINTS = ['0px', '200px', '600px']
const MAP = new TwoWayMap<DrawerState, string>(new Map<DrawerState, string>([
  ['closed', SNAP_POINTS[0]],
  ['micro', SNAP_POINTS[1]],
  ['options', SNAP_POINTS[2]]
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
        console.log('DATA FN: ', isCheckout, ui.buyOptionsSkuPath, ui.recentSku)
        if (isCheckout) return 'closed'
        if (ui.buyOptionsSkuPath) return 'options' 
        if (ui.recentSku) return 'micro'
        return 'closed'
      }, 
      (state) => {
        console.log('REACTION FN: ', state)
        if (shouldReactRef.current) {
          stateRef.current.set(state)
        }
        shouldReactRef.current = true
      }
    )
  }, [isCheckout])


  const setSnap = (v: string | number | null): void => {
    const state = v ? MAP.revGet(v as string)! : 'closed'

    console.log('SETSNAP FN: ', v, state)


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
    stateRef.current.set(state)
  }

  const handleCheckout = () => {router.push('/checkout')}

    // Should only ever be called to close
  const reallyOnlyCloseDrawer = (b: boolean) => {
    if (!b) {
      stateRef.current.set('closed')
    }
  }

  console.log("RENDERING... ", stateRef.current.value, MAP.get(stateRef.current.value))

  return (<>
    <CommerceDrawer 
      open={stateRef.current.value !== 'closed'} 
      setOpen={reallyOnlyCloseDrawer}
      modal={true /*stateRef.current.value === 'options' */}
      snapPoints={SNAP_POINTS}
      activeSnapPoint={MAP.get(stateRef.current.value) ?? '0px'}
      setActiveSnapPoint={setSnap}
      drawerClx={`h-[${MAP.get(stateRef.current.value) ?? '0px'}]`}
    >
    {stateRef.current.value === 'micro' && (<>
      <div className='w-full flex justify-between'>
        <p>recently add: {ui.recentSku}</p>
        <Button onClick={() => {ui.showBuyOptions(ui.recentSku!)}} variant='outline' rounded='lg' className='w-full'>
          open options
        </Button>
      </div>
      <Button onClick={handleCheckout} variant='primary' rounded='lg' className='w-full'>
        {`Checkout (${cmmc.cartQuantity})`}
      </Button>
    </>)}
    {stateRef.current.value === 'options' && (
      <CarouselBuyCard 
        skuPath={ui.buyOptionsSkuPath!} 
        handleCheckout={handleCheckout} 
        clx='w-full'
      />
    )}
    </CommerceDrawer>
    {stateRef.current.value === 'closed' && !cmmc.cartEmpty && (
      <Button onClick={handleCheckout} variant='primary' rounded='lg' className='w-[320px] absolute right-[200px] bottom-[20px]'>
        {`Checkout (${cmmc.cartQuantity})`}
      </Button>
    )}
  </>)
})

export default CommerceUIComponent
