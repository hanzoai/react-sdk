'use client'
import React, { type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'

import { Icons } from '@hanzo/cart/components/Icons'
import { useCommerce } from '@hanzo/cart/service'

import { DrawerMenu } from '@hanzo/ui/common'
import { buttonVariants, Badge } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

const CartDrawer: React.FC<PropsWithChildren & {
  className?: string, 
  buttonClassName?: string
}> = ({
  children,
  className='',
  buttonClassName=''
}) => {

  const c = useCommerce()
  const CartButton: React.FC<{className?: string}> = observer(({
    className=''
  }) => (
    // has to be a div masquerading as a button (asChild doesn't seem to work in shadcn)
      <div
        aria-label="Cart"
        role='button'
        className={cn(buttonVariants({ variant: 'outline', size: 'icon', rounded: 'lg' }), className)}
      >
      {c.cartItems.length > 0 && (
        <Badge
          variant="secondary"
          className="absolute -right-2 -top-2 g-6 w-6 h-6 font-sans text-xs rounded-full p-2"
        >
          {c.cartItems.length}
        </Badge>
      )}
        <Icons.shoppingCart className="h-4 w-4" aria-hidden="true" />
      </div>            
  ))

  return (
    <DrawerMenu 
      className={className}  
      propogate={false}
      trigger={<CartButton className={'relative ' + buttonClassName} />}
    >
      {children}
    </DrawerMenu>
  )
}



export default CartDrawer
