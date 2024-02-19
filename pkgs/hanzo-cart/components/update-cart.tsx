'use client'

import React from 'react'
import { useCart } from '../service/commerce/context'
import type { LineItem } from '../types'
import {
  Button,
  Input,
} from '@hanzo/ui/primitives'
import { Trash } from 'lucide-react'

interface CartItemActionsProps {
  item: LineItem
}

export function CartItemActions({ item }: CartItemActionsProps) {
  const { updateCartItemQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (qty: number) => {
    const quantity = Number(qty)
    if (quantity >= 1) {
      updateCartItemQuantity(item.sku, quantity)
    }
  }

  const handleRemoveClick = () => {
    removeFromCart(item.sku)
  }

  return (<>
    <div className='flex items-center gap-1'>
      <Button variant='outline' size='square' className='flex items-center' onClick={() => handleQuantityChange(item.quantity - 1)}>-</Button>
      <Input
        type='number'
        min='1'
        value={item.quantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
      />
      <Button variant='outline' size='square' className='flex items-center' onClick={() => handleQuantityChange(item.quantity + 1)}>+</Button>
      <Button variant='outline' size='square' className='flex items-center' onClick={handleRemoveClick}><Trash className='h-4 w-4'/></Button>
    </div>
  </>)
}
