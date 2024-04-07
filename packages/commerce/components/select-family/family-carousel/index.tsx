'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

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
import type { Dimensions } from '@hanzo/ui/types'

import type { Family, LineItem, CategoryNode } from '../../../types'
import { formatCurrencyValue } from '../../../util'


const FamilyCarousel: React.FC<{
  skuPath: string
  clx?: string
  itemClx?: string
  options?: CarouselOptions
  mediaConstraint?: Dimensions
  getBylineText?: (c: Family) => string
  variantOrientation?: 'vert' | 'horiz' 
  showVariantImage?: boolean
  showVariantPrice?: boolean
  onQuantityChanged?: (sku: string, oldV: number, newV: number) => void
  mobile?: boolean
}> = observer(({ 
  skuPath,
  clx='',
  itemClx='',
  options={loop: true},
  mediaConstraint={w: 250, h: 250},
  variantOrientation='vert',
  showVariantImage=true,
  showVariantPrice=true,
  onQuantityChanged,
  mobile=false,
}) => {

  const elbaApiRef = useRef<CarouselApi | undefined>(undefined)
  const setApi = (api: CarouselApi) => {elbaApiRef.current = api}

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    const index = emblaApi.selectedScrollSnap()
    if (index !== -1) {
      //selectSku(items[index].sku)
      // cmmc.selectPath
    }
  }, [])

  const TEST = ["one", "two", "three"]

  return ( 
    <Carousel options={options} className={cn('w-full px-2', clx)} onCarouselSelect={onSelect} setApi={setApi}>
      <CarouselContent>

      {/*items.map((item, index) => (
        <CarouselItem key={index} className={cn('p-2 flex flex-col justify-center items-center', itemClx)}>
          <FamilySlide cat
        </CarouselItem>
      ))*/}
      </CarouselContent>
      <CarouselPrevious className='left-1'/>
      <CarouselNext className='right-1'/>
    </Carousel>
  )
})

export default FamilyCarousel
