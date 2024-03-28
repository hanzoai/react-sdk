'use client'
import React, { useRef, useEffect, type ComponentType } from 'react'
import { autorun  } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import type { FacetsValue, ItemSelectorProps, LineItem } from '../../types'
import { useCommerce } from '../../service/context'
import { getFacetValuesMutator } from '../../util'

import FacetValuesWidget from '../facet-values-widget'
import AddToCartWidget from './add-to-cart-widget'

const AllVariantsBuyCard: React.FC<{
  skuPath: string
  className?: string
  facetsWidgetClx?: string
  Selector: ComponentType<ItemSelectorProps>
  selShowPrice?: boolean
  selShowQuantity?: boolean
  selClx?: string
  selItemClx?: string
  selExt?: any
  addWidgetClx?: string
  isMobile?: boolean
  onQuantityChanged?: (sku: string, oldV: number, newV: number) => void
}> = observer(({
  skuPath,
  className='',
  facetsWidgetClx='',
  Selector,
  selShowPrice=true,
  selShowQuantity=false,
  selClx='',
  selItemClx='',
  selExt,
  addWidgetClx='',
  isMobile=false,
  onQuantityChanged,
}) => {

  const cmmc = useCommerce()
  const levelRef = useRef<number>(-1)

  const cat = cmmc.getCategory(skuPath) 
  const facets = cat ? undefined : cmmc.getFacetValuesAtSkuPath(skuPath)

  useEffect(() => {

    const toks = skuPath.split('-')
    levelRef.current = toks.length - 1
    const fsv: FacetsValue = {}
    for (let level = 1; level <= levelRef.current; level++ ) {
      fsv[level] = [toks[level]]   
    } 
    if (!cat) {
      fsv[levelRef.current + 1] = [facets![0].value]
    }
    cmmc.setFacets(fsv)

  /*
    return autorun(() => {
      const cats = cmmc.specifiedCategories
        // Original cat was legit
      if (cat && (cats.length === 0 || cats[0].id !== cat.id)) {
        if (!cmmc.currentItem || cmmc.currentItem.categoryId !== cat.id) {
          cmmc.setCurrentItem(cat.products[0].sku)
        }
      }
      else if (cats.length > 0) {
        if (!cmmc.currentItem || cmmc.currentItem.categoryId !== cats[0].id) {
          cmmc.setCurrentItem(cats[0].products[0].sku)
        }
      }
    })
  */
  }, [cat, facets])

  const renderFacetTabs = facets && levelRef.current > 0

  return (
    <div className={className} >
    {renderFacetTabs && (
      <FacetValuesWidget
        className={cn(
          'grid gap-0 ' + `grid-cols-${facets.length}` + ' self-start ', 
          'border-b-2 border-level-3 mb-2 -mr-2 -ml-2',
          facetsWidgetClx  
        )} 
        isMobile={isMobile}
        mutator={getFacetValuesMutator(levelRef.current + 1, cmmc)} 
        itemClx='flex-col h-auto gap-0 pb-1 pt-3 px-3'
        buttonClx={
          'h-full !rounded-bl-none !rounded-br-none !rounded-tl-lg !rounded-tr-lg ' +
          '!border-r !border-t !border-level-3'
        }
        facetValues={facets}
      />
    )}
    {cmmc.specifiedCategories[0] && (
      <Selector 
        items={cmmc.specifiedCategories[0].products as LineItem[]}
        selectedItemRef={cmmc}
        selectSku={cmmc.setCurrentItem.bind(cmmc)}
        className={selClx}
        itemClx={selItemClx}
        ext={selExt}
        showPrice={selShowPrice}
        showQuantity={selShowQuantity}
      />  
    )}
    {(cmmc.currentItem) && (
      <AddToCartWidget 
        size='default' 
        item={cmmc.currentItem}
        onQuantityChanged={onQuantityChanged} 
        className={cn('lg:min-w-[160px] lg:mx-auto', addWidgetClx)}
      />
    )} 
    </div >
  )
})

export default AllVariantsBuyCard
