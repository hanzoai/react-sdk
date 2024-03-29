'use client'
import React, { useState, type ReactNode } from 'react'

//import { X as LucideX} from 'lucide-react'
//import { Sheet, SheetContent, SheetTrigger } from '@hanzo/ui/primitives'

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
} from '@hanzo/ui/primitives'

import { cn } from '@hanzo/ui/util'

import BuyCard from './buy-card'
import RadioItemSelector from '../select/radio-selector'

const BuyDrawer: React.FC<{
  skuPath: string
  trigger: ReactNode
  triggerClx?: string  
  drawerClx?: string
  cardClx?: string
  mobile?: boolean
}> = ({
  skuPath,
  trigger,
  triggerClx='',
  drawerClx='',
  cardClx='',
  mobile=false
}) => {

  const [open, setOpen] = useState<boolean>(false)

  const onQuantityChanged = (sku: string, oldV: number, newV: number) => {
    if (oldV === 0 && newV === 1) {
      setTimeout(() => {setOpen(false)}, 150)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} >
      <DrawerTrigger asChild className={triggerClx}>
        {trigger}
      </DrawerTrigger>
      <DrawerContent 
        className={cn('rounded-t-xl z-[52] mt-6 pb-12 h-auto min-h-[35vh] pt-6', drawerClx)}
        overlayClx='z-[51]'
      >
        <BuyCard 
          skuPath={skuPath} 
          mobile={mobile} 
          onQuantityChanged={onQuantityChanged} 
          className={cn('w-full', cardClx)}
          Selector={RadioItemSelector}
          selClx=''
          selItemClx=''
          selSoleItemClx='mb-3'
          addWidgetClx=''
        />
      </DrawerContent>
    </Drawer>
  )
}

export default BuyDrawer
