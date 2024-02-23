import React from 'react'

import type { LineItem } from '../types'
import { formatPrice } from '../util'

const LineItemComponent: React.FC<{
  item: LineItem
}> = ({ 
  item 
}) => {
  return (
    <div className='flex items-center space-x-4'>
      <div className='flex flex-col gap-1 self-start text-sm'>
        <span className='line-clamp-1'>{item.product.title}</span>
        <span className='line-clamp-1 text-muted-foreground'>
          {formatPrice(item.product.price)} x {item.quantity} 
        </span>
      </div>
    </div>
  )
}

export default LineItemComponent
