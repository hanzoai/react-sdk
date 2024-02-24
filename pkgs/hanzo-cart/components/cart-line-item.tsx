import React from 'react'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'

import { cn } from '@hanzo/ui/util'

import type { LineItem } from '../types'
import QuantityWidget from './quantity-widget'
import { formatPrice } from '../util'

const IMG_SIZE=40

const CartLineItem: React.FC<{
  item: LineItem
  className?: string
  isMobile?: boolean
}> = observer(({ 
  item,
  className='',
  isMobile=false 
}) => {

  const imgSrc = (!!item.product.img) ? ((typeof item.product.img === 'string') ? item.product.img : item.product.img.src) : null

  const imgSize = (isMobile) ? IMG_SIZE * 0.65 : IMG_SIZE

  return (
    <div className='flex flex-row justify-between items-center gap-2 sm:gap-4'>
    {!!imgSrc ? (
      <Image src={imgSrc} alt={item.product.title + ' image'} height={imgSize} width={imgSize} className='self-start'/>
    ) : (
      <div style={{height: imgSize, width: imgSize}}/ >
    )}
      <div className={cn('text-sm font-sans grow', className)} >
        <div className=''>{item.product.title}</div>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center'>
            <QuantityWidget isMobile={isMobile} className='mr-2' item={item} ghost/>{item.quantity > 1 && '@' + formatPrice(item.product.price)}
          </div>
          <div className='flex flex-row items-center justify-end'>
            {formatPrice(item.product.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  )
})

export default CartLineItem
