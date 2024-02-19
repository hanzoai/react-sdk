'use client'
import * as React from 'react'

import { ImageBlockComponent, type ImageBlock } from '@hanzo/ui/blocks'

import { CartItemActions } from './update-cart'
import type { LineItem } from '../types'
import { formatPrice } from '../util'

interface CartItemProps {
  item: LineItem
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className='flex items-center space-x-4'>
      <div className='relative h-16 w-16 overflow-hidden rounded'>
        <ImageBlockComponent block={{blockType: 'image',
          src: item.image,
          alt: item.title,
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
        <span className='line-clamp-1'>{item.title}</span>
        <span className='line-clamp-1 text-muted-foreground'>
          {formatPrice(item.price)} x {item.quantity} ={' '}
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
      <CartItemActions item={item} />
    </div>
  )
}
