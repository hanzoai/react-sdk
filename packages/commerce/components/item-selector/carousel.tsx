'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import type { Dimensions } from '@hanzo/ui/types'

import {
  type CarouselOptions,
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  ApplyTypography,
  MediaStack
} from '@hanzo/ui/primitives'

import type { ItemSelectorProps, LineItem } from '../../types'
import { formatCurrencyValue } from '../../util'

interface CarouselItemSelectorPropsExt {
  constrainTo: Dimensions
  options?: CarouselOptions 
    /** Do not show Family and / or Item title and Price */
  imageOnly?: boolean
}
  
const CarouselItemSelector: React.FC<ItemSelectorProps> = observer(({ 
  items,
  selectSku,
  selectedItemRef: itemRef,
  scrollList, // ignored
  clx='',
  itemClx='',
  showFamily=false,
  ext={
    options: {loop: true},
    constrainTo: {w: 250, h: 250},
    imageOnly: false 
  } satisfies CarouselItemSelectorPropsExt
}) => {

  const { options, constrainTo, imageOnly} = ext

  const elbaApiRef = useRef<CarouselApi | undefined>(undefined)
  const dontRespondRef = useRef<boolean>(false)

  const setApi = (api: CarouselApi) => {elbaApiRef.current = api}

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (dontRespondRef.current) {
      dontRespondRef.current = false
      return
    }
    const index = emblaApi.selectedScrollSnap()
    if (index !== -1) {
      selectSku(items[index].sku)
    }
    dontRespondRef.current = false
  }, [])

  useEffect(() => {
    return reaction(
      () => ({item: itemRef.item}),
      ({item}) => {
        if (elbaApiRef.current) {
          const index = items.findIndex((el) => (el.sku === item?.sku))  
          if (index !== -1) {
            dontRespondRef.current = true
            elbaApiRef.current.scrollTo(index) 
          }
        }
      }  
    )
  }, [])

  const ItemInfo: React.FC<{
    item: LineItem
    clx?: string
  }> = ({
    item,
    clx
  }) => (
    <ApplyTypography className={cn(clx, 'flex flex-col items-center !gap-2 [&>*]:!m-0')}>
      {showFamily && (<h4>{item.familyTitle}</h4>)}
      <p>{item.optionLabel}</p>
      <p>{formatCurrencyValue(item.price)}</p>
    </ApplyTypography>
  )

  return ( 
    <Carousel options={options} className={cn('w-full px-2', clx)} onCarouselSelect={onSelect} setApi={setApi}>
      <CarouselContent>
      {items.map((item, index) => (
        <CarouselItem key={index} className={cn('p-2 flex flex-col justify-center items-center', itemClx)}>
          <MediaStack media={item} constrainTo={constrainTo} clx='' />
          {!imageOnly && (<ItemInfo item={item} clx=''/>)}
        </CarouselItem>
      ))}
      </CarouselContent>
      <CarouselPrevious className='left-1'/>
      <CarouselNext className='right-1'/>
    </Carousel>
  )
})

export {
  type CarouselItemSelectorPropsExt,
  CarouselItemSelector as default 
}
