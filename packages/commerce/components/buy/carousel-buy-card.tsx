'use client'
import React, { useRef, useEffect, type ComponentType } from 'react'
import { reaction, type IReactionDisposer } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import { ApplyTypography, MediaStack } from '@hanzo/ui/primitives'

import type { 
  SelectedPaths, 
  ItemSelectorProps, 
  ItemSelectorCompProps,
  LineItem, 
  Family, 
  CategoryNode, 
} from '../../types'

import { useCommerce } from '../../service/context'
import { ObsStringMutator } from '../../util'
import * as pathUtils from '../../service/path-utils'

import AddToCartWidget from './add-to-cart-widget'

const CarouselBuyCard: React.FC<{
  skuPath: string

    /** For any selectors that show a list of choices,
     * starting with 'scrollAfter' elements, 
     * the list will scroll, and the card will
     * have 'scrollHeightClx' applied to it to define and fix the height.
     * This is most like something like '80vh' 
     * defaults are '5' and 'h-[70vh]'
     * */
  scrollAfter?: number
  scrollHeightClx?: string

  clx?: string
  famWidgetClx?: string
  addWidgetClx?: string
  selector: ComponentType<ItemSelectorProps>
  selectorProps?: ItemSelectorCompProps 

    /** Show all items from all sibling families
     * If skuPath defines a Family, the first of it's items will 
     * be selected. The facet widget will just select a the first 
     * item in the chosen Family without changings the overall set
     * of choices. */
  allVariants?: boolean

  familyTabAs?: 'image' | 'label' | 'image-and-label'
  showItemMedia?: boolean

  onQuantityChanged?: (sku: string, oldV: number, newV: number) => void
  mobile?: boolean
}> = observer(({
  skuPath,
  scrollAfter=5,
  scrollHeightClx='h-[80vh]',
  clx='',
  famWidgetClx='',
  addWidgetClx='',
  selector: Selector,
  selectorProps={
    clx: '',
    soleItemClx: '',
    itemClx: '',
    ext: {}
  },
  familyTabAs='image-and-label', 
  showItemMedia=true,
  allVariants=false,
  mobile=false,
  onQuantityChanged,
}) => {

  const cmmc = useCommerce()
  const inst = useRef<{
    level: number,
    reqFamily : Family | undefined
    parentNode: CategoryNode | undefined
    disposers: IReactionDisposer[]
  } | undefined>(undefined)


  useEffect(() => {

    let reqFamily = cmmc.getFamily(skuPath) 
    let parentNode = reqFamily ? undefined : cmmc.getNodeAtPath(skuPath)
    let initialFamily = undefined
    const { paths, level } = pathUtils.getSelectedPaths(skuPath)

    if (level === 0) {
      throw new Error('BuyCard.useEffect(): must specify at least at least one Level in skuPath!') 
    }
    if (reqFamily) { 
      if (allVariants && level >= 2) {
          // select all siblings of reqFamily.
          // ie, go one level back
        delete paths[level]
        initialFamily = reqFamily
        reqFamily = undefined
        parentNode = cmmc.getNodeAtPath(pathUtils.getParentPath(skuPath))
      }
    }
    else {
        // select siblings paths
      if (allVariants) {
        paths[level + 1] = [...parentNode!.subNodes!.map((node) => (node.skuToken))]
      }
        // Actually select the the first fam at the fam level, 
      else {
        paths[level + 1] = [parentNode!.subNodes![0].skuToken]
      }
    }

    const selFamilies = cmmc.selectPaths(paths)
    initialFamily = initialFamily ? initialFamily : (reqFamily ? reqFamily : selFamilies[0])
    cmmc.setCurrentItem(initialFamily.products[0].sku)
      // TODO
    const currentFamily = new ObsStringMutator(pathUtils.lastToken(initialFamily!.id))

    inst.current = {
      level,
      reqFamily,
      parentNode,
      disposers: []
    }

    if (!allVariants) {
      inst.current?.disposers.push(reaction(
        () => {
          const fams = cmmc.selectedFamilies
          return (fams.length > 0) ? fams[0].id : undefined
        },
        (famId) => {
          if (famId && famId !== cmmc.currentItem?.familyId) {
            const fam = cmmc.getFamily(famId)
            if (fam) { 
              cmmc.setCurrentItem(fam.products[0].sku) 
            }
          }
        }
      ))
    }

    return () => {
      inst.current?.disposers.forEach((d) => {d()})
    }

  }, [])

  const setFamilyPath = (pathValue: string | null) => {
    const found = cmmc.selectedItems.find((item) => (item.familyId.endsWith(pathValue!)))
    if (found) { 
      cmmc.setCurrentItem(found.sku) 
    }
  }

  const selectSku = (sku: string) => {
    cmmc.setCurrentItem(sku)
      // TODO
    const pathValue = pathUtils.lastToken(cmmc.currentItem!.familyId)
  }

  const famTitle = inst.current?.reqFamily ? inst.current.reqFamily.title : cmmc.selectedFamilies?.[0]?.title

  const itemsToShow = (!cmmc.hasSelection) ? undefined : 
    allVariants ? cmmc.selectedItems : cmmc.selectedFamilies[0].products as LineItem[]


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

  const scroll = !!(itemsToShow && itemsToShow.length > scrollAfter)
  return (
    <div className={cn(
      'px-4 md:px-6 pt-3 pb-4 flex flex-col items-center min-h-[60vh]', 
      clx,
      scroll ? scrollHeightClx : 'h-auto'
    )} >
    {inst.current?.parentNode && (<>
      <ApplyTypography className={'mb-2 ' + (scroll ? 'shrink-0' : '')}>
        <h3>{inst.current!.parentNode.label}</h3>
        {inst.current!.parentNode.subNodesLabel && (
          <h6 className='!text-center font-bold text-muted mt-3'>{inst.current!.parentNode.subNodesLabel}</h6>
        )}
      </ApplyTypography>
      {/* }
      <LevelNodesWidget
        className={cn(
          'grid gap-0 align-stretch justify-normal ' + `grid-cols-${inst.current.parentNode.subNodes!.length}`, 
          'border-b-2 rounded-lg border-level-3 mb-4 -mr-2 -ml-2 max-w-[460px] h-10', // height is needed for iPhone bug
          (scroll ? 'shrink-0' : ''),
          famWidgetClx  
        )} 
        mobile={mobile}
        mutator={allVariants ? 
          {
            get: () => (inst.current!.currentFamily.s),
            set: setFamilyPath
          }
          : 
          getFacetValuesMutator(inst.current.level + 1, cmmc)
        } 
        itemClx='flex-col h-auto gap-0 py-1 px-3'
        buttonClx={
          'h-full ' +
          '!border-level-3'
        }
        levelNodes={inst.current.parentNode.subNodes!}
        show={familyTabAs}
      />
      */}
    </>)} 
    {!inst.current?.parentNode && famTitle && (
      <TitleArea title={famTitle} clx=''/>
    )}
    {(cmmc.currentItem && showItemMedia) && (
      <MediaStack media={cmmc.currentItem} constrainTo={{w: 200, h: 200}} clx={(scroll ? 'shrink-0' : '')}/>
    )} 
    {itemsToShow && (
      <Selector 
        items={itemsToShow}
        selectedItemRef={cmmc}
        selectSku={selectSku}
        {...selectorProps}
        scrollList={scroll}
        showFamily={selectorProps.showFamily ? 
          selectorProps.showFamily
          :
          (allVariants && !inst.current?.reqFamily)
        }
      />  
    )}
    {(cmmc.currentItem) && (
      <AddToCartWidget 
        size='default' 
        item={cmmc.currentItem}
        onQuantityChanged={onQuantityChanged} 
        className={cn('min-w-[160px] mx-auto mt-4', (scroll ? 'shrink-0' : ''), addWidgetClx)}
      />
    )} 
    </div >
  )
})

export default CarouselBuyCard
