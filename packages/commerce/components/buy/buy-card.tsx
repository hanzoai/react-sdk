'use client'
import React, { useRef, useEffect, type ComponentType } from 'react'
import { reaction, type IReactionDisposer } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import type { 
  SelectedPaths, 
  ItemSelectorProps, 
  LineItem, 
  Category, 
  ProductTreeNode, 
} from '../../types'

import { useCommerce } from '../../service/context'
import { getFacetValuesMutator, ObsStringMutator } from '../../util'

import LevelNodesWidget from '../level-nodes-widget'
import AddToCartWidget from './add-to-cart-widget'
import ItemMedia from '../item/item-media'
import { ApplyTypography } from '@hanzo/ui/primitives'

const BuyCard: React.FC<{
  skuPath: string
  selector: ComponentType<ItemSelectorProps>
  selShowPrice?: boolean
  selShowQuantity?: boolean
  selClx?: string
  selSoleItemClx?: string
  selItemClx?: string
  selExt?: any
  allVariants?: boolean
  className?: string
  facetsWidgetClx?: string
  facetsAs?: 'image' | 'label' | 'image-and-label'
  addWidgetClx?: string
  mobile?: boolean
  onQuantityChanged?: (sku: string, oldV: number, newV: number) => void
}> = observer(({
  skuPath,
  className='',
  facetsWidgetClx='',
  selector: Selector,
  selShowPrice=true,
  selShowQuantity=false,
  selClx='',
  selItemClx='',
  selSoleItemClx='',
  selExt,
  addWidgetClx='',
  facetsAs='image-and-label', 
  allVariants=false,
  mobile=false,
  onQuantityChanged,
}) => {

  const cmmc = useCommerce()
  const inst = useRef<{
    level: number,
    requestedCat : Category | undefined
    requestedNode: ProductTreeNode | undefined
    currentCat: ObsStringMutator
    disposers: IReactionDisposer[]
  } | undefined>(undefined)


  useEffect(() => {

    let requestedCat = cmmc.getCategory(skuPath) 
    let requestedNode = requestedCat ? undefined : cmmc.getNodeAtPath(skuPath)
    const toks = skuPath.split('-')
    const level = toks.length - 1
    if (level === 0) {
      throw new Error('BuyCard.useEffect(): must specify at least at least one Level in skuPath!') 
    }
    const paths: SelectedPaths = {}
    for (let l = 1; l <= level; l++ ) {
      paths[l] = [toks[l]]   
    } 
    if (requestedCat) { 
      if (allVariants) {
          // select all siblings of requestedCat (buy deleting last token from the object)
        delete paths[level]
        requestedCat = undefined
        const _path = toks.slice(0, -1).join('-') 
        requestedNode = cmmc.getNodeAtPath(_path)
      }
    }
    else {
        // select siblings paths
      if (allVariants) {
        paths[level + 1] = [...requestedNode!.subNodes!.map((node) => (node.skuToken))]
      }
        // Actually select the the first cat at the cat level, 
      else {
        paths[level + 1] = [requestedNode!.subNodes![0].skuToken]
      }
    }

    const selectedCats = cmmc.selectPaths(paths)
    const initialCat = requestedCat ? requestedCat : selectedCats[0]
    const initialPathValue = initialCat?.id.split('-').pop()!
    cmmc.setCurrentItem(initialCat.products[0].sku)

    inst.current = {
      level,
      requestedCat,
      requestedNode,
      currentCat: new ObsStringMutator(initialPathValue),
      disposers: []
    }

    return () => {
      inst.current?.disposers.forEach((d) => {d()})
    }

  }, [])

  const setCatPath = (pathValue: string | null) => {
    if (inst.current?.currentCat.get() !== pathValue) {
      inst.current?.currentCat.set(pathValue) 
    }
    const found = cmmc.selectedItems.find((item) => (item.categoryId.endsWith(pathValue!)))
    if (found) { 
      cmmc.setCurrentItem(found.sku) 
    }
  }

  const selectSku = (sku: string) => {
    cmmc.setCurrentItem(sku)
    const pathValue = cmmc.currentItem?.categoryId.split('-').pop()!
    console.log("SEL SKU: ", pathValue)
    if (pathValue !== inst.current?.currentCat.get()) {
      inst.current?.currentCat.set(pathValue) 
    }
  }

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

  const catTitle = inst.current?.requestedCat ? inst.current.requestedCat.title : cmmc.selectedCategories?.[0]?.title

  const itemsToShow = (!cmmc.hasSelection) ? undefined : 
    allVariants ? cmmc.selectedItems : cmmc.selectedCategories[0].products as LineItem[]

  return (
    <div className={cn('px-4 md:px-6 pt-3 pb-4 flex flex-col items-center', className)} >
    {inst.current?.requestedNode && (<>
      <ApplyTypography className=''>
        <h3>{inst.current!.requestedNode.label}</h3>
        {inst.current!.requestedNode.subNodesLabel && (
          <h6 className='!text-center font-bold text-muted mt-3 mb-2'>{inst.current!.requestedNode.subNodesLabel}</h6>
        )}
      </ApplyTypography>
      <LevelNodesWidget
        className={cn(
          'grid gap-0 ' + `grid-cols-${inst.current.requestedNode.subNodes!.length}`, 
          'border-b-2 rounded-lg border-level-3 mb-4 -mr-2 -ml-2 max-w-[460px]',
          facetsWidgetClx  
        )} 
        mobile={mobile}
        mutator={allVariants ? 
          {
            get: () => (inst.current!.currentCat.s),
            set: setCatPath
          }
          : 
          getFacetValuesMutator(inst.current.level + 1, cmmc)
        } 
        itemClx='flex-col h-auto gap-0 py-1 px-3'
        buttonClx={
          'h-full ' +
          '!border-level-3'
        }
        levelNodes={inst.current.requestedNode.subNodes!}
        show={facetsAs}
      />
    </>)} 
    {!inst.current?.requestedNode && catTitle && (
      <TitleArea title={catTitle} clx=''/>
    )}
    {(cmmc.currentItem) && (<ItemMedia item={cmmc.currentItem} constrainTo={{w: 200, h: 200}}/>)} 
    {itemsToShow && (
      <Selector 
        items={itemsToShow}
        selectedItemRef={cmmc}
        selectSku={selectSku}
        clx={selClx}
        itemClx={selItemClx}
        soleItemClx={selSoleItemClx}
        ext={selExt}
        showCategoryName={allVariants}
        showPrice={selShowPrice}
        showQuantity={selShowQuantity}
      />  
    )}
    {(cmmc.currentItem) && (
      <AddToCartWidget 
        size='default' 
        item={cmmc.currentItem}
        onQuantityChanged={onQuantityChanged} 
        className={cn('min-w-[160px] mx-auto mt-4', addWidgetClx)}
      />
    )} 
    </div >
  )
})

export default BuyCard
