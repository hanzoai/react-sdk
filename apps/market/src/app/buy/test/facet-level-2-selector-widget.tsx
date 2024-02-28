'use client'
import React, { useEffect } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import { formatPrice } from '@hanzo/cart/util'

import { FacetTogglesWidget,  } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'
import type { FacetsSelection, LineItem } from '@hanzo/cart/types'
import { ApplyTypography, ListBox } from '@hanzo/ui/primitives'

const formatItem = (item: LineItem, withQuantity: boolean = false): string => (
  `${item.titleAsOption}, ${formatPrice(item.price)}${(withQuantity && item.quantity > 0) ? `  (${item.quantity})` : ''}`
)

const L2_FACET_VALUES = siteDef.ext.commerce.facets[2]

const FacetLevel2SelectorWidget: React.FC<{
  level1token: string
  className?: string
}> = observer(({
  level1token, 
  className=''
}) => {
  const comm = useCommerce()

  useEffect(() => {
    comm.setFacetsSelection({
      1: [level1token],
      2: [L2_FACET_VALUES[0].token]
    } satisfies FacetsSelection as FacetsSelection)
  }, [])

  const onFacetTokenChanged = (token: string): void => {
    comm.setFacetsSelection({
      1: [level1token],
      2: [token]
    } satisfies FacetsSelection as FacetsSelection)
  }

  const currentFacetToken = computed((): string | null => {
    if (comm.specifiedCategories.length === 0) return null
    const skuPath = comm.specifiedCategories[0].id
    const skuPathTokens = skuPath.split('-')
    return skuPathTokens.length > 0 ? skuPathTokens[skuPathTokens.length - 1] : null
  })

  return (
    <div className={cn('flex flex-col justify-start gap-4 items-start pt-3', className)}>
      <FacetTogglesWidget 
        facetValues={L2_FACET_VALUES} 
        mutator={{
          val: currentFacetToken.get(),
          set: onFacetTokenChanged
        }} 
      />
      {comm.specifiedItems.length === 0 ? (
        <ApplyTypography>
          <h3>No Items</h3>
        </ApplyTypography>
      ) : comm.specifiedItems.length === 1 ? (
        <ApplyTypography>
          <h4>{formatItem(comm.specifiedItems[0])}</h4>
        </ApplyTypography>
      ) : (
        <ListBox<string> 
          values={comm.specifiedItems.map((it) => (it.sku))}   
          labels={comm.specifiedItems.map((it) => (formatItem(it)))}   
          isEqual={(v1: string, v2: string) => (v1 === v2)}
          value={comm.currentItem?.sku}
          onValueChange={comm.setCurrentItem.bind(comm)}
        />
      )}
    </div>
  )
})

export default FacetLevel2SelectorWidget
