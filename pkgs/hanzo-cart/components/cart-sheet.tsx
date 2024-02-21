'use client'

import * as React from 'react'
import Badge from '@hanzo/ui/primitives/badge'
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Separator,
  ScrollArea,
  SheetClose
} from '@hanzo/ui/primitives'

import { useCart } from '../service/commerce/context'
import { CartItem } from './cart-item'
import CartIcon from './cart-icon'
import { X } from 'lucide-react'
import  { CTABlockComponent, type CTABlock } from '@hanzo/ui/blocks'
import type { LinkDef } from '@hanzo/ui/types'

export default function CartSheet() {
  const { cartItems } = useCart()
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const sumPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label='Cart'
          variant='outline'
          size='sm'
        >
          <div className='flex gap-2'>
            <CartIcon fill='white' className='w-5 h-5' />
            {itemCount > 0 && (
              <Badge className='rounded-full justify-center w-12'>
                {itemCount > 99 ? '99+' : itemCount}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg' closeButtonClass='float-right' closeElement={null}>
        <SheetHeader className='px-1'>
          <SheetTitle className='flex justify-between items-center'>Cart {itemCount > 0 && `(${itemCount})`}<SheetClose><X/></SheetClose></SheetTitle>
        </SheetHeader>
        <Separator />
        {itemCount > 0 ? (
          <>
            <div className='flex flex-1 flex-col gap-5 overflow-hidden'>
              <ScrollArea className='h-full'>
                <div className='flex flex-col gap-5 pr-6'>
                  {cartItems.map((item) => (
                    <div key={item.product.id} className='space-y-3'>
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <CTABlockComponent block={{blockType: 'cta',
              elements: [{title: `CHECKOUT (${sumPrice} USD)`, href: '/checkout', variant: 'primary'} as LinkDef]} as CTABlock
            } itemSize='lg'/>
          </>
        ) : (
          <h5>Your cart is empty</h5>
        )}
      </SheetContent>
    </Sheet>
  )
}