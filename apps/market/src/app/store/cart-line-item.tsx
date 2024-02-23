import React from 'react'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'

import { cn } from '@hanzo/ui/util'

import { QuantityWidget } from '@hanzo/cart/components'
import type { LineItem } from '@hanzo/cart/types'
import { formatPrice } from '@hanzo/cart/util'

const CartLineItem: React.FC<{
  item: LineItem
  className?: string
}> = observer(({ 
  item,
  className='' 
}) => {

  const costLineClx = (item.quantity === 1) ? 'justify-end' : 'justify-between'

  const imgSrc = (!!item.product.img) ? ((typeof item.product.img === 'string') ? item.product.img : item.product.img.src) : null

  return (
    <div>
      {imgSrc ? <Image src={imgSrc} alt={item.product.title + ' image'} height={100} width={100} /> : <div style={{height: 100, width: 100}}/ >}
      <div className={cn('grid gap-0 text-sm font-sans', className)} style={{gridTemplateColumns: ' auto 20%'}}>
        <div className=''>{item.product.title/*.split(', ').map((el, i, arr) => (<p key={i}>{el}{(i < arr.length - 1) ? ',' : ''}</p>))*/}</div>
        <div />
        <div className='flex flex-row items-center'>
          <QuantityWidget className='mr-2' item={item} ghost/>{item.quantity > 1 && '@' + formatPrice(item.product.price)}
        </div>
        <div className='flex flex-row items-center justify-end'>
          {formatPrice(item.product.price * item.quantity)}
        </div>
      </div>
    </div>
  )
})

export default CartLineItem
