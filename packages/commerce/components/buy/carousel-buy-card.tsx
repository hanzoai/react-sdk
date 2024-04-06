'use client'
import React, { useRef, useEffect, type ComponentType } from 'react'
import { reaction, type IReactionDisposer } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import { ApplyTypography, MediaStack, Skeleton } from '@hanzo/ui/primitives'

import type { 
  SelectedPaths, 
  ItemSelectorProps, 
  ItemSelectorCompProps,
  LineItem, 
  Family, 
  CategoryNode,
  CategoryNodeRole,
  SelectionUISpecifier, 
} from '../../types'

import { useCommerce } from '../../service/context'
import * as pathUtils from '../../service/path-utils'
import { ObsStringMutator, getSelectionUISpecifier } from '../../util'

import { 
  CarouselItemSelector, 
  ImageButtonItemSelector, 
  ButtonItemSelector 
} from '../item-selector'

import AddToCartWidget from './add-to-cart-widget'

const CarouselBuyCard: React.FC<{
  skuPath: string
  clx?: string
  mobile?: boolean
  onQuantityChanged?: (sku: string, oldV: number, newV: number) => void
}> = observer(({
  skuPath,
  clx='',
  /*
  selectorProps={
    clx: '',
    soleItemClx: '',
    itemClx: '',
    ext: {}
  },
  */
  mobile=false,
  onQuantityChanged,
}) => {

  const cmmc = useCommerce()

  const inst = useRef<{
    role: CategoryNodeRole
    family: Family | undefined
    families: Family[] | undefined
    node: CategoryNode 
    familyTokenMutator: ObsStringMutator | undefined
    uiSpec: SelectionUISpecifier
  } | undefined>(undefined)

  useEffect(() => {

    const peek = cmmc.peekAtNode(skuPath)
    if (peek.role === 'non-node') {
      throw new Error(`BuyCard: skuPath ${skuPath} isn't in the node tree!`)
    }
    else if (peek.role === 'non-terminal') {
      throw new Error(`BuyCard: skuPath ${skuPath} isn't an outermost tree node or product family!`)
    }

    let familyTokenMutator: ObsStringMutator | undefined = undefined
    if (peek.families) {
      const initialFamily = peek.family ? peek.family : peek.families[0]
      familyTokenMutator = new ObsStringMutator(pathUtils.lastToken(initialFamily.id))
    }

    inst.current = {
      ...peek,
      node: peek.node!, // else exception was thrown.
      familyTokenMutator: familyTokenMutator,
      uiSpec: getSelectionUISpecifier(skuPath),
    }

  }, [])

  const singleFamily = () => (inst.current?.role === 'terminal')

  const familyItems = singleFamily() ? inst.current?.family?.products as LineItem[] : undefined  
  let Selector: ComponentType<ItemSelectorProps> = CarouselItemSelector // for compiler
  if (singleFamily()) {
    const selType = inst.current?.uiSpec.singleFamily  
    Selector = (selType === 'buttons' ? 
      ButtonItemSelector
      :
      ((selType === 'image-buttons') ? 
        ImageButtonItemSelector  
        :
        CarouselItemSelector
      )
    )
  }

  const TitleArea: React.FC<{
    title: string
    byline?: string
    clx?: string
    bylineClx?: string
  }> = ({
    title,
    byline,
    clx='',
    bylineClx='' 
  }) => (
    <ApplyTypography className={clx}>
      <h3>{title}</h3>
      {byline && (<h6 className={bylineClx}>{byline}</h6>)}
    </ApplyTypography>
  )

  const scrollAfter = 5
  const scrollHeightClx = 'h-[80vh]'
  const scroll = !!(familyItems && familyItems.length > scrollAfter)
  const showItemMedia = inst.current?.uiSpec.singleFamily !== 'carousel'

  return (
    <div className={cn(
      'px-4 md:px-6 pt-3 pb-4 flex flex-col items-center min-h-[60vh]', 
      clx,
      scroll ? scrollHeightClx : 'h-auto'
    )}>
    {singleFamily() ? (<>
      <TitleArea title={inst.current?.family?.title ?? ''} clx=''/>
      {(showItemMedia && cmmc.currentItem ) && (
        <MediaStack media={cmmc.currentItem} constrainTo={{w: 200, h: 200}} clx={(scroll ? 'shrink-0' : '')}/>
      )}
      {(showItemMedia && !cmmc.currentItem ) && (
        <Skeleton className={'w-[200px] h-[200px] ' + (scroll ? 'shrink-0' : '')}/>
      )}
      {familyItems && (
        <Selector 
          items={familyItems}
          selectedItemRef={cmmc}
          selectSku={cmmc.setCurrentItem.bind(cmmc)}
          scrollList={scroll}
          showFamily={false}
        />  
      )}
    </>) : (
      <TitleArea 
        title={inst.current?.node.label ?? ''} 
        byline={inst.current?.node.subNodesLabel ?? ''} 
        clx={'mb-2 ' + (scroll ? 'shrink-0' : '')}
        bylineClx='!text-center font-bold text-muted mt-3'
      />
    ) /* TODO: THE GRAND SELECTOR */ }
    {(cmmc.currentItem) && (
      <AddToCartWidget 
        size='default' 
        item={cmmc.currentItem}
        onQuantityChanged={onQuantityChanged} 
        className={cn('min-w-[160px] mx-auto mt-4', (scroll ? 'shrink-0' : '') /*, addWidgetClx */)}
      />
    )} 
    </div >
  )
})

export default CarouselBuyCard
