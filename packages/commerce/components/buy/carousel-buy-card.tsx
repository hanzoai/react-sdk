'use client'
import React, { 
  useRef, 
  useEffect, 
  type ComponentType, 
  useState 
} from 'react'
import { observer, Observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import { 
  ApplyTypography, 
  Button, 
  MediaStack, 
  Skeleton 
} from '@hanzo/ui/primitives'

import type { 
  ItemSelectorProps, 
  LineItem, 
  Family, 
  CategoryNode,
  CategoryNodeRole,
  SelectionUISpecifier,
  ItemSelectorOptions,
  MultiFamilySelectorProps, 
} from '../../types'

import { useCommerce } from '../../service/context'
import { getSelectionUISpecifier, accessOptionValues } from '../../util'

import { CarouselItemSelector, ButtonItemSelector } from '../item-selector'
import { FamilyCarousel, AllVariantsCarousel } from '../node-selector'

import AddToCartWidget from './add-to-cart-widget'

const SCROLL = {
  scrollAfter: 5,
  scrollHeightClx: 'h-[65vh]'
}

const MEDIA_CONSTRAINT = {w: 200, h: 200}

const sortItems = (items: LineItem[], sort: 'asc' | 'desc' | 'none'): LineItem[] => (

  (sort === 'asc') ? 
    items.sort((a: LineItem, b: LineItem): number => (a.price - b.price))
    :
    ((sort === 'desc') ?   
      items.sort((a: LineItem, b: LineItem): number => (b.price - a.price ))
      :
      items)
)

const CarouselBuyCard: React.FC<{
  skuPath: string
  clx?: string
  mobile?: boolean
  handleCheckout: () => void
  onQuantityChanged?: (sku: string, oldV: number, newV: number) => void
}> = ({
  skuPath,
  clx='',
  mobile=false,
  handleCheckout,
  onQuantityChanged,
}) => {

  const cmmc = useCommerce()

  const r = useRef<{
    role: CategoryNodeRole
    item: LineItem | undefined
    family: Family | undefined
    families: Family[] | undefined
    node: CategoryNode 
    uiSpec: SelectionUISpecifier
    single?: {
      items: LineItem[]
      Selector: ComponentType<ItemSelectorProps>
      selOptions: ItemSelectorOptions | undefined
      scrollable: boolean
      showItemMedia: boolean
    }
    multi?: {
      Selector: ComponentType<MultiFamilySelectorProps>
      itemOptions: ItemSelectorOptions | undefined
      initialFamilyId: string
    }  
  } | undefined>(undefined)

  const [changeMeToRerender, setChangeMeToRerender] = useState<boolean>(false)

  useEffect(() => {

    const peek = cmmc.peek(skuPath)
    if (typeof peek === 'string') {
      throw new Error(peek)
    }
    if (peek.role === 'non-outermost') {
      throw new Error(`BuyCard: skuPath ${skuPath} isn't an outermost tree node or product family!`)
    }


    const uiSpec = getSelectionUISpecifier(skuPath)

    r.current = {
      ...peek,
      node: peek.node!, // else exception was thrown.
      uiSpec,
    }

    if (peek.role === 'single-family') {

      const sort = (): 'none' | 'asc' | 'desc' => {
        if (!uiSpec.singleFamily?.options) {
          return 'none'
        }
        const options = uiSpec.singleFamily.options
        const showSlider = 'showSlider' in options ? options.showSlider! : true
        return ('sort' in options) ? 
          options.sort!
          :
          (showSlider ? 'asc' : 'none')
      }


      const items = peek.family!.products as LineItem[]
      const Selector: ComponentType<ItemSelectorProps> = 
        (uiSpec.singleFamily?.type === 'buttons') ? ButtonItemSelector : CarouselItemSelector
      const selOptions = uiSpec.singleFamily?.options

      r.current.single = {
        items: sortItems(items, sort()),
        Selector,
        selOptions,
        scrollable: !!(items.length > SCROLL.scrollAfter),
        showItemMedia: uiSpec.singleFamily?.type !== 'carousel'
      }

      const currItem = peek.item ?? r.current.single.items[0]
      cmmc.setCurrentItem(currItem.sku)
    }
    else {
      const initialFamily = peek.family ? peek.family : peek.families![0]
        // TODO: Does this ever need to be sorted??
      const currItem = peek.item ?? initialFamily.products[0]
      cmmc.setCurrentItem(currItem.sku)

      r.current.multi = {
        Selector:  (uiSpec.multiFamily?.type === 'family-carousel') ? 
          FamilyCarousel 
          : 
          AllVariantsCarousel,
        itemOptions: uiSpec.multiFamily?.options,
        initialFamilyId: initialFamily.id
      }

    }

      // Must do this since Dialog code takes this comp out of the React shadow DOM
      // (only in prod apparently.)
    setChangeMeToRerender(!changeMeToRerender)

  }, [skuPath])

  const TitleArea: React.FC<{ clx?: string }> = ({
    clx='',
  }) => {

    if (!r.current) return null

    const options = (r.current.uiSpec.singleFamily) ?
      r.current.uiSpec.singleFamily.options : r.current.uiSpec.multiFamily!.options  

    const { showFamilyTitle, showFamilyByline } = accessOptionValues(options)

    const title = showFamilyTitle ? r.current.family?.title : undefined
    const byline = showFamilyTitle && showFamilyByline ? r.current.family?.byline :  undefined

    /*
    let title: string | undefined
    let byline: string | undefined

    if (r.current?.uiSpec.singleFamily) {
      const { showFamilyTitle, showFamilyByline } = accessOptionValues(r.current?.uiSpec.singleFamily.options)
      title = showFamilyTitle ? r.current.family?.title : undefined,
      byline = showFamilyTitle && showFamilyByline ? r.current?.family?.byline :  undefined
    }
    else {
      title =  r.current?.uiSpec.multiFamily?.showParentTitle 
        ? 
        r.current?.family?.parentTitle : undefined,
      byline = undefined
    }
    */
      /* 
        Could also be:
          title = {r.current?.node.label ?? ''} 
          byline = {r.current?.node.subNodesLabel} 
      */

    return ( title || byline ? (
      <ApplyTypography className={cn('flex flex-col items-center !gap-0 [&>*]:!m-0 ', clx)}>
        <h4>{title}</h4>
        {byline && (<h6 className=''>{byline}</h6>)}
      </ApplyTypography>
      ) : null
    )
  }

  const SingleFamilyUI: React.FC<{
    items: LineItem[]
    Selector: ComponentType<ItemSelectorProps>
    selOptions: ItemSelectorOptions | undefined
    scrollable: boolean
    showItemMedia: boolean
  }> = ({
    items,
    Selector,
    selOptions,
    scrollable,
    showItemMedia
  }) => (<>
    {(showItemMedia && cmmc.currentItem ) && (
      <Observer>
        {() => (
          <MediaStack 
            media={cmmc.currentItem!} 
            constrainTo={MEDIA_CONSTRAINT} 
            clx={'mb-2 ' + (scrollable ? 'shrink-0' : '')}
          />
        )}
      </Observer>
    )}
    {(showItemMedia && !cmmc.currentItem ) && (
      <Skeleton className={'w-[200px] h-[200px] my-2 ' + (scrollable ? 'shrink-0' : '')}/>
    )}
    {items && (
      <Selector 
        items={items}
        selectedItemRef={cmmc}
        selectSku={cmmc.setCurrentItem.bind(cmmc)}
        scrollable={scrollable}
        mobile={mobile}
        options={selOptions}
      />  
    )}
  </>)

  const MultiFamilyUI: React.FC<{      
    Selector: ComponentType<MultiFamilySelectorProps>
    itemOptions: ItemSelectorOptions | undefined
    families: Family[]
    initialFamilyId: string
  }> = ({
    Selector,
    itemOptions,
    families,
    initialFamilyId
  }) => (
    <Selector 
      families={families}
      initialFamilyId={initialFamilyId}
      clx='w-full'
      itemOptions={itemOptions}
      mediaConstraint={MEDIA_CONSTRAINT}
      mobile={mobile}
    />
  )

  const Buttons: React.FC<{clx?: string}> = observer(({
    clx=''
  }) => (cmmc.currentItem ? (
    <div className={clx}>
      <AddToCartWidget 
        item={cmmc.currentItem}
        onQuantityChanged={onQuantityChanged} 
        variant={cmmc.cartEmpty ? 'primary' : 'outline'}
        className='min-w-[160px] w-full sm:max-w-[320px]' 
      />
      {!cmmc.cartEmpty && (
        <Button 
          onClick={handleCheckout} 
          variant='primary' 
          rounded='lg' 
          className='min-w-[160px] w-full sm:max-w-[320px]'
        >
          Checkout
        </Button>
      )}
    </div>
  ) : null))

  return (
    <div className={cn(
      'px-4 md:px-6 pt-3 pb-4 flex flex-col gap-1 items-center min-h-[40vh]', 
      clx,
      r.current?.single?.scrollable ? SCROLL.scrollHeightClx : 'h-auto'
    )}>
      <TitleArea clx='' />
      {r.current?.single ? ( 
        <SingleFamilyUI {...r.current.single} /> 
      ) : (r.current?.multi && r.current.families && /* safegaurd for first render, etc. */ (
        <MultiFamilyUI {...r.current.multi} families={r.current.families} />
      ))}
      <Buttons clx={cn(
        'self-stretch mt-8 flex flex-col items-center gap-3',
        (r.current?.single?.scrollable ? 'shrink-0' : '')
      )}/>
    </div >
  )
}

export default CarouselBuyCard
