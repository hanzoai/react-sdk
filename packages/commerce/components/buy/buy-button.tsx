'use client'
import React, {type PropsWithChildren} from 'react'

import { type ButtonVariants, type ButtonSizes, Button } from '@hanzo/ui/primitives'

import BuyTriggerWrapper from './buy-trigger-wrapper'
import { cn } from '@hanzo/ui/util'

const BuyButton: React.FC<PropsWithChildren & {
  skuPath: string
  variant? : ButtonVariants 
  size?: ButtonSizes  
  /* rounded?: ButtonRounded // TODO: wait for version bump*/
  className?: string 
  popupClx?: string
}> = ({
  skuPath,
  variant,
  size,
  children,
  className='',
  popupClx=''
}) => (
  <BuyTriggerWrapper 
    skuPath={skuPath} popupClx={popupClx} 
    desktopTrigger={
      <Button size={size} variant={variant} className={cn(className, 'hidden md:flex')}>{children}</Button>
    }
    mobileTrigger={
      <Button size={size} variant={variant} className={cn(className, 'md:hidden')}>{children}</Button>
    }
  />
)



export default BuyButton
