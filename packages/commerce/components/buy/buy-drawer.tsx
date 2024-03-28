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

import BuyCard from './all-variants-buy-card'
import RadioItemSelector from '../select/radio-selector'

const BuyDrawer: React.FC<{
  skuPath: string
  trigger: ReactNode
  isMobile?: boolean
  triggerClx?: string  
  drawerClx?: string
  cardClx?: string
}> = ({
  skuPath,
  trigger,
  isMobile=false,
  triggerClx='',
  drawerClx='',
  cardClx=''
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
        className={cn('rounded-tl-xl rounded-tr-xl p-0 overflow-hidden', drawerClx)}
       // side="bottom" 
      >
        <BuyCard 
          skuPath={skuPath} 
          isMobile={isMobile} 
          onQuantityChanged={onQuantityChanged} 
          className={cn("w-full relative ", cardClx)}
          Selector={RadioItemSelector}
          selClx=''
          selItemClx=''
          addWidgetClx=''
        />
      </DrawerContent>
    </Drawer>
  )
}

export default BuyDrawer
