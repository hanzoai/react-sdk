'use client'
import React, { useEffect, useState, type PropsWithChildren, useRef, useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
} from 'next-usequerystate'

import { cn } from '@hanzo/ui/util'
import { formatPrice } from '@hanzo/cart/util'

import { Cart, FacetTogglesWidget,  } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'

import siteDef from '@/siteDef'
import CartDrawer from '@/components/cart-drawer'
import type { Category, FacetsSelection, LineItem } from '@hanzo/cart/types'
import Link from 'next/link'
import { ApplyTypography, ListBox } from '@hanzo/ui/primitives'

const formatItem = (item: LineItem, withQuantity: boolean = false): string => (
  `${item.titleAsOption}, ${formatPrice(item.price)}${(withQuantity && item.quantity > 0) ? `  (${item.quantity})` : ''}`
)

const L2_FACET_VALUES = siteDef.ext.commerce.facets[2]

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

const TestPage: React.FC<Props> = observer(({
  searchParams
}) => {

  const comm = useCommerce()

  const onFacetTokenChanged = (token: string): void => {
    comm.setFacetsSelection({
      1: ['AG'],
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
    <div /* id='TEST_OUTERMOST' */ className='grid grid-cols-3 gap-6 w-full' >
      <div /* id='TEST_COL_1' */ className='flex flex-col justify-start gap-4 items-start pt-3 '>
        <ApplyTypography>
        {comm.specifiedCategories.length > 0 ? (<>
          <h2>{comm.specifiedCategories[0].title}</h2>
          {comm.currentItem && (
            <h4>{comm.currentItem.title}</h4>
          )}
        </>): (
          <h6>no category</h6>
        )}
        </ApplyTypography>
      </div>
      <div /* id='id='TEST_COL_2' */ className='flex flex-col justify-start gap-4 items-start pt-3'>
        <FacetTogglesWidget 
          facetValues={L2_FACET_VALUES} 
          mutator={{
            val: currentFacetToken.get(),
            set: onFacetTokenChanged
          }} 
        />
        {comm.specifiedItems.length === 0 ? (
          <h3>No Items</h3>
        ) : comm.specifiedItems.length === 1 ? (
          <h4>{formatItem(comm.specifiedItems[0])}</h4>
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
      <div /* id='id='TEST_COL_3' */ className='flex flex-col justify-start gap-4 items-start pt-3'>
        <Cart >
          <h4 className='text-center font-heading text-lg'>Lux Market Cart</h4>
        </Cart>
      </div> 
    </div>
  )
}) 

export default TestPage
