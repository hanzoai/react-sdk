'use client'

import { Label, RadioGroup, RadioGroupItem } from '@hanzo/ui/primitives'
import type { ItemSelector } from '../types'
import { formatPrice } from '../util'

const CategoryItemRadioSelector: React.FC<ItemSelector & {
  groupClx?: string
  itemClx?: string
}> = ({
  category,
  selectedItemRef: itemRef,
  selectSku,
  groupClx='',
  itemClx='',
  showPrice=true
}) => (
  category.products.length > 1 && (
    <RadioGroup
      className={groupClx}
      onValueChange={selectSku}
      value={itemRef.item ? itemRef.item.sku : ''}
    >
    {category.products.map((prod) => (
      <div className={itemClx} key={prod.sku}>
        <RadioGroupItem value={prod.sku} id={prod.sku} />
        <Label htmlFor={prod.sku}>{prod.titleAsOption + (showPrice ? (', ' + formatPrice(prod.price)) : '')}</Label>
      </div>
    ))}
    </RadioGroup>
  )
)

export default CategoryItemRadioSelector
