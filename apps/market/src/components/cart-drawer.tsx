'use client'
import React, { type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'

import { Icons } from '@hanzo/cart/components/Icons'
import { useCommerce } from '@hanzo/cart/service'

import { DrawerMenu } from '@hanzo/ui/common'
import { Button, Badge } from '@hanzo/ui/primitives'

const CartDrawer: React.FC<PropsWithChildren & {className?: string}> = ({
  children,
  className=''
}) => {

  const c = useCommerce()
  const CartButton: React.FC<{className?: string}> = observer(({
    className=''
  }) => (
      <Button
        aria-label="Cart"
        variant="outline"
        size="icon"
        className={className}
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
      </Button>            
  ))

  return (
    <DrawerMenu 
      className={className}  
      propogate={false}
      asChild
      trigger={<CartButton className='relative' />}
    >
      {children}
    </DrawerMenu>
  )
}



export default CartDrawer
