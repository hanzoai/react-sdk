'use client'
import React, { type ReactNode } from 'react'

import { X as LucideX} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@hanzo/ui/primitives'

import { cn } from '@hanzo/ui/util'

import BuyItemCard from './buy-item-card'

const BuyItemMobileDrawer: React.FC<{
  skuPath: string
  trigger: ReactNode
  triggerClx?: string  
  drawerClx?: string
  cardClx?: string
}> = ({
  skuPath,
  trigger,
  triggerClx='',
  drawerClx='',
  cardClx=''
}) => {

  return (
    <Sheet  >
      <SheetTrigger className={triggerClx}>
        {trigger}
      </SheetTrigger>
      <SheetContent 
        className={cn('rounded-tl-xl rounded-tr-xl p-0 overflow-hidden border-none', drawerClx)}
        side="bottom" 
      >
        <BuyItemCard skuPath={skuPath} mobile className={cn("w-full relative ", cardClx)}/>
      </SheetContent>
    </Sheet>
  )
}

export default BuyItemMobileDrawer
