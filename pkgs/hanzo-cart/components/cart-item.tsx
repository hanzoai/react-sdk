'use client'

import * as React from 'react'
import { formatPrice } from '../lib/utils'
import { CartItemActions } from './update-cart'
import type { CartItem } from '../context/cart-context'
import { ImageBlockComponent, type ImageBlock } from '@hanzo/ui/blocks'

interface CartItemProps {
  item: CartItem
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className='flex items-center space-x-4'>
      <div className='relative h-16 w-16 overflow-hidden rounded'>
        <ImageBlockComponent block={{blockType: 'image',
          src: item.product.image,
          alt: item.product.title,
          dim: {w: 1172, h: 1920},
          props: {
            style: {
              width: 'auto',
              height: '100%'
            }
          }
        } as ImageBlock} />
      </div>
      <div className='flex flex-1 flex-col gap-1 self-start text-sm'>
        <span className='line-clamp-1'>{item.product.title}</span>
        <span className='line-clamp-1 text-muted-foreground'>
          {formatPrice(item.product.price)} x {item.quantity} ={' '}
          {formatPrice(item.product.price * item.quantity)}
        </span>
      </div>
      <CartItemActions item={item} />
    </div>
  )
}
