'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { Label, RadioGroup, RadioGroupItem } from '@hanzo/ui/primitives'
import type { ItemSelectorProps, LineItem } from '../../types'
import { formatPrice } from '../../util'
import { cn } from '@hanzo/ui/util'

const RadioItemSelector: React.FC<ItemSelectorProps> = observer(({
  items,
  selectedItemRef: itemRef,
  selectSku,
  className='',
  itemClx='',
  showPrice=true,
  showQuantity=true
}) => {

  const Choice: React.FC<{
    item: LineItem
    className?: string
  }> = ({
    item,
    className=''
  }) => (
    <div className={cn(className, itemClx)}>
      <RadioGroupItem value={item.sku} id={item.sku} />
      <Label htmlFor={item.sku}>{item.titleAsOption + (showPrice ? (', ' + formatPrice(item.price)) : '')}</Label>
    </div>
  )

  return items.length > 1 ? (
    <RadioGroup
      className={cn(showQuantity ? 'table' : '', className)}
      onValueChange={selectSku}
      value={itemRef.item ? itemRef.item.sku : ''}
    >
    {items.map((item) => (showQuantity ? (
      <div className='table-row' key={item.sku}>
        <Choice item={item} className='table-cell pr-2 align-text-top pb-2'/>
        <div className='table-cell font-semibold text-sm leading-none align-text-top pb-2'>{ item.quantity > 0 ? `(${item.quantity})` : ' '}</div>
      </div>
    ) : (
      <Choice item={item} className='mb-2'  key={item.sku}/>
    )))}
    </RadioGroup>
  ) : (<p>TODO</p>)
})

export default RadioItemSelector
