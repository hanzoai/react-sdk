'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import ItemMedia from '../item/item-media'

import {
  type CarouselOptionsType,
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@hanzo/ui/primitives'

import type { ItemSelectorProps } from '../../types'

interface CarouselItemSelectorPropsExt {
  constrainTo: {w: number, h: number}
  options?: CarouselOptionsType 
  noSelection?: boolean // "display only" mode
}
  
const CarouselItemSelector: React.FC<ItemSelectorProps> = observer(({ 
  items,
  selectSku,
  selectedItemRef: itemRef,
  clx='',
  itemClx='',
  ext={
    options: {},
    constrainTo: {w: 250, h: 250} 
  } satisfies CarouselItemSelectorPropsExt
}) => {

  const { options, constrainTo} = ext

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

  return ( 
    <Carousel options={options} className={cn('px-2', clx)} onSelect={onSelect} setApi={setApi}>
      <CarouselContent>
      {items.map((item, index) => (
        <CarouselItem key={index} className={cn('p-2 flex flex-row justify-center items-center', itemClx)}>
          <ItemMedia item={item} constrainTo={constrainTo} clx='' />
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
