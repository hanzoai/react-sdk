'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { Label, RadioGroup, Image } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import type { ItemSelectorProps, LineItem } from '../../types'
import { formatCurrencyValue } from '../../util'

const ImageRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'value' | 'id'> & {
    item: LineItem,
    imgSizePx: number  
  }
>(({ 
  item,
  imgSizePx,
  className, 
  ...props 
}, ref) => {

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      id={item.sku}
      value={item.sku}
    >
      {item.img ? (
        <Image def={item.img} constrainTo={{w: imgSizePx, h: imgSizePx}} preload className=''/>
      ) : ( // placeholder so things align
        <div style={{height: imgSizePx, width: imgSizePx}}/>
      )}
    </RadioGroupPrimitive.Item>
  )
})
ImageRadioGroupItem.displayName = 'ImageRadioGroupItem'

const ImageItemSelector: React.FC<ItemSelectorProps> = observer(({
  items,
  selectedItemRef: itemRef,
  selectSku,
  clx='',
  itemClx='',
  soleItemClx='',
  showCategoryName=false,
  showPrice=true,
  showQuantity=false
}) => {

  const Choice: React.FC<{
    item: LineItem
    className?: string
  }> = ({
    item,
    className=''
  }) => (
    <div className={cn('flex items-center mb-1', className, itemClx)}>
      <ImageRadioGroupItem 
        item={item} 
        imgSizePx={40} 
        className='mr-2 border-2 border-transparent rounded-sm data-[state=checked]:border-foreground'
      />
      <Label htmlFor={item.sku}>{
        (showCategoryName ? item.title : item.optionLabel) + 
        (showPrice ? (', ' + formatCurrencyValue(item.price)) : '')
      }</Label>
    </div>
  )

  const SoleChoice: React.FC<{
    item: LineItem
    className?: string
  }> = ({
    item,
    className=''
  }) => (
    <div className={cn(className, soleItemClx)}>
      {item.optionLabel + (showPrice ? (', ' + formatCurrencyValue(item.price)) : '')}
    </div>
  )

  return items.length > 1 ? (
    <RadioGroup
      className={cn('gap-0', showQuantity ? 'table' : '', clx)}
      onValueChange={selectSku}
      value={itemRef.item ? itemRef.item.sku : ''}
    >
    {items.map((item) => (showQuantity ? (
      <div className='table-row' key={item.sku}>
        <Choice item={item} className='table-cell pr-2 align-text-top pb-3'/>
        <div className='table-cell font-semibold text-sm leading-none align-text-top pb-3'>{ item.quantity > 0 ? `(${item.quantity})` : ' '}</div>
      </div>
    ) : (
      <Choice item={item} className='mb-3'  key={item.sku}/>
    )))}
    </RadioGroup>
  ) : (
    <SoleChoice item={items[0]} className=''/>
  )
})

export default ImageItemSelector
