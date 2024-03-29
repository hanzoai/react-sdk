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
import ItemMedia from '../item/item-media'
import { ApplyTypography } from '@hanzo/ui/primitives'

const BuyCard: React.FC<{
  skuPath: string
  Selector: ComponentType<ItemSelectorProps>
  selShowPrice?: boolean
  selShowQuantity?: boolean
  selClx?: string
  selSoleItemClx?: string
  selItemClx?: string
  selExt?: any
  allVariants?: boolean
  className?: string
  facetsWidgetClx?: string
  addWidgetClx?: string
  mobile?: boolean
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
  selSoleItemClx='',
  selExt,
  addWidgetClx='',
  allVariants=true,
  mobile=false,
  onQuantityChanged,
}) => {

  const cmmc = useCommerce()
  const levelRef = useRef<number>(-1)

  const requestedCat = cmmc.getCategory(skuPath) 
  const facetValues = requestedCat ? undefined : cmmc.getFacetValuesAtSkuPath(skuPath)

  useEffect(() => {

    const toks = skuPath.split('-')
    levelRef.current = toks.length - 1
    if (levelRef.current === 0) {
      throw new Error('BuyCard.useEffect(): must specify at least a Level 1 skuPath!') 
    }
    const fsv: FacetsValue = {}
    for (let level = 1; level <= levelRef.current; level++ ) {
      fsv[level] = [toks[level]]   
    } 
      // Actually specify the requested Cat, 
      // or the first Cat if no Cats at this level
    if (!requestedCat) {
      fsv[levelRef.current + 1] = [facetValues![0].value]
    }
    cmmc.setFacets(fsv)

    return autorun(() => {
      //const cats = cmmc.specifiedCategories
        // Original requestedCat was legit
      if (requestedCat /* && (cats.length === 0 || cats[0].id !== requestedCat.id) */) {
        if (
          !cmmc.currentItem 
          || 
          cmmc.currentItem.categoryId !== requestedCat.id 
          || 
          requestedCat.products.length === 1
        ) {
          cmmc.setCurrentItem(requestedCat.products[0].sku)
        }
      }
      /*
      else if (cats.length > 0) {
        if (!cmmc.currentItem || cmmc.currentItem.categoryId !== cats[0].id) {
          cmmc.setCurrentItem(cats[0].products[0].sku)
        }
      }
      */
    })
  }, [requestedCat, facetValues])

  const TitleArea: React.FC<{
    title: string
    byline?: string
    clx?: string
  }> = ({
    title,
    byline,
    clx='' 
  }) => (
    <ApplyTypography className={clx}>
      <h3>{title}</h3>
      {byline && (<h6>{byline}</h6>)}
    </ApplyTypography>
  )

  return (
    <div className={cn('px-4 md:px-6 pt-3 pb-4 flex flex-col items-center', className)} >
    {facetValues && (
      <FacetValuesWidget
        className={cn(
          'grid gap-0 ' + `grid-cols-${facetValues.length}` + ' self-start ', 
          'border-b-2 border-level-3 mb-2 -mr-2 -ml-2',
          facetsWidgetClx  
        )} 
        mobile={mobile}
        mutator={getFacetValuesMutator(levelRef.current + 1, cmmc)} 
        itemClx='flex-col h-auto gap-0 pb-1 pt-3 px-3'
        buttonClx={
          'h-full !rounded-bl-none !rounded-br-none !rounded-tl-lg !rounded-tr-lg ' +
          '!border-r !border-t !border-level-3'
        }
        facetValues={facetValues}
      />
    )} 
    {requestedCat && (
      <TitleArea title={requestedCat.title} clx=''/>
    )}
    {(cmmc.currentItem) && (<ItemMedia item={cmmc.currentItem} />)} 
    {cmmc.specifiedCategories[0] && (
      <Selector 
        items={cmmc.specifiedCategories[0].products as LineItem[]}
        selectedItemRef={cmmc}
        selectSku={cmmc.setCurrentItem.bind(cmmc)}
        clx={selClx}
        itemClx={selItemClx}
        soleItemClx={selSoleItemClx}
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
        className={cn('min-w-[160px] mx-auto', addWidgetClx)}
      />
    )} 
    </div >
  )
})

export default BuyCard
