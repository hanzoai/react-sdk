'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import { ScrollArea } from '@hanzo/ui/primitives'

import type { ItemSelectorProps } from '../../types'
import { formatCurrencyValue } from '../../util'


const ListItemSelector: React.FC<ItemSelectorProps> = observer(({
  items,
  selectedItemRef: iRef,
  selectSku,
  clx='',
  itemClx=''
}) => (
  <ScrollArea className={cn('border border-muted-4 rounded-lg', clx)}>
    {items.map((item) => (
      <div key={item.sku} onClick={() => {selectSku(item.sku)}}>
        <div className={cn(
          'h-10 border-b flex flex-col justify-center px-4',
          (iRef.item?.sku === item.sku) ? 'font-semibold text-accent' : 'text-muted', 
          itemClx
        )}>
          {item.titleAsOption + ', ' + formatCurrencyValue(item.price)}
        </div>
      </div>
    ))}
  </ScrollArea>
))

export default ListItemSelector
