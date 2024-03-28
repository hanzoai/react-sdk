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
}> = ({
  skuPath,
  variant,
  size,
  children,
  className=''
}) => (
  <BuyTriggerWrapper skuPath={skuPath}
    trigger={  <Button size={size} variant={variant} className={cn(className, '')}>{children}</Button> }
  />
)



export default BuyButton
