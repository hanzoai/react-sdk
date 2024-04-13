'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { observable, reaction, type IObservableValue } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import {
  ApplyTypography,
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  MediaStack,
} from '@hanzo/ui/primitives'

import type { MultiFamilySelectorProps, LineItem, Family } from '../../../types'
import { formatCurrencyValue, accessOptionValues } from '../../../util'

import QuantityIndicator from '../../quantity-indicator'
import { useCommerce } from '../../..'

const DEFAULT_CONSTRAINT = {w: 250, h: 250}

const AllVariantsCarousel: React.FC<MultiFamilySelectorProps> = observer(({ 
  families,
  initialFamilyId,
  clx='',
  itemClx='',
  itemOptions,
  mediaConstraint=DEFAULT_CONSTRAINT,
  mobile=false, // not relavant to any children
}) => {
   
  const cmmc = useCommerce()
  const elbaApiRef = useRef<CarouselApi | undefined>(undefined)
  const itemsRef = useRef<LineItem[] | undefined>(undefined)
  const familyStartIndexMapRef = useRef<Map<string, number>>(new Map<string, number>())
  const dontRespondRef = useRef<boolean>(false)
  const currentFamilyObsRef = useRef<IObservableValue<string>>(observable.box(initialFamilyId))

  const setApi = (api: CarouselApi) => {elbaApiRef.current = api}
  
  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (dontRespondRef.current) {
      dontRespondRef.current = false
      return
    }
    const index = emblaApi.selectedScrollSnap()
    if (index !== -1) {
      const item = itemsRef.current?.[index]
      cmmc.setCurrentItem(item?.sku)
      if (item && item.familyId !== currentFamilyObsRef.current.get()) {
        currentFamilyObsRef.current.set(item.familyId)
      }
    }
    dontRespondRef.current = false
  }, [])

  useEffect(() => {

    const allItems: LineItem[] = []
    families.forEach((fam) => {
      const items = fam.products as LineItem[]
      familyStartIndexMapRef.current.set(fam.id, allItems.length)
      allItems.push(...items)
    })
    itemsRef.current = allItems

    return reaction(
      () => (cmmc.currentItem),
      (item) => {
        if (elbaApiRef.current) {
          const index = itemsRef.current!.findIndex((_item: LineItem) => (_item.sku === item?.sku))  
          if (index !== -1) {
            // no need to sync family, since ui only allows selecting within a family            
            dontRespondRef.current = true
            elbaApiRef.current.scrollTo(index) 
          }
        }
      }  
    )
  }, [])

  const debugBorder = (c: 'r' | 'g' | 'b'): string => {
     return ''

    switch (c) {
      case 'r': return ' border border-[#ffaaaa] '
      case 'g': return ' border border-[#aaffaa] '
      case 'b': return ' border border-[#aaaaff] '
    }
  }

  const onScrollIndexChange = (index: number) => {
    dontRespondRef.current = true
    cmmc.setCurrentItem(itemsRef.current?.[index].sku)
    elbaApiRef.current?.scrollTo(index) 
  }

  const ItemInfo: React.FC = () => {

    const {
      showPrice, 
      showQuantity,
      showFamilyInOption,
      showByline,
    } = accessOptionValues(itemOptions)
    
    const optionLabel = () => (
      showFamilyInOption ? 
        (cmmc.currentItem!.familyTitle + ', ' + cmmc.currentItem!.optionLabel) 
        : 
        cmmc.currentItem!.optionLabel 
    )

    return (cmmc.currentItem && (<>
      <ApplyTypography className='flex flex-col items-center [&>*]:!m-0 !gap-1 '>
          <div className={
            'flex items-center gap-1 [&>*]:!m-0 ' + debugBorder('g') + 
            (showFamilyInOption ? 'flex-col' : 'flex-row')
          }>
            <h6 className='font-semibold'>
              {optionLabel() + (showPrice && !showFamilyInOption ? ',' : '')}
            </h6>
            <div className={
              'flex items-center gap-1 [&>*]:!m-0 flex-row ' +  debugBorder('b') +  
              (showFamilyInOption ? 'w-full justify-between' : '')
            }>
              {showPrice && (<p>{formatCurrencyValue(cmmc.currentItem.price)}</p>)}
              {showQuantity && (
                <QuantityIndicator 
                  item={cmmc.currentItem} 
                  clx='h-[22px] ml-4' 
                  iconClx='fill-foreground'
                  digitClx='not-typography font-semibold text-primary-fg leading-none font-sans text-xs' 
                />
              )}
            </div>
          </div>
          {showByline && cmmc.currentItem.byline && (<p>{cmmc.currentItem.byline}</p>)}
        </ApplyTypography>
    </>))
  }

  return ( 
    <div className={cn('w-full flex flex-col items-center', clx)}>
      <Carousel 
        options={{loop: true} } 
        className={'w-full px-2' + debugBorder('r')} 
        onCarouselSelect={onSelect} 
        setApi={setApi}
      >
        <CarouselContent>
        {itemsRef.current?.map((item) => (
          <CarouselItem key={item.sku} className={cn('p-2 flex flex-col justify-center items-center', itemClx)}>
            <MediaStack media={item} constrainTo={mediaConstraint} clx='my-4'/>
          </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious className='left-1'/>
        <CarouselNext className='right-1'/>
      </Carousel>
    
      <ItemInfo />
    </div>
  )
})

export {
  AllVariantsCarousel as default 
}
