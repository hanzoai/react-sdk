'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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

import type { MultiFamilySelectorProps, LineItem } from '../../../types'
import { formatCurrencyValue, accessOptionValues } from '../../../util'

import QuantityIndicator from '../../quantity-indicator'
import { useCommerce } from '../../..'
import TitleAndByline from '../title-and-byline'

const debugBorder = (c: 'r' | 'g' | 'b', disable: boolean = true): string => {

  if (disable) {
    return ''
  }
  switch (c) {
    case 'r': return ' border border-[#ffaaaa] '
    case 'g': return ' border border-[#aaffaa] '
    case 'b': return ' border border-[#aaaaff] '
  }
}

const DEFAULT_CONSTRAINT = {w: 250, h: 250}

const AllVariantsCarousel: React.FC<MultiFamilySelectorProps> = ({ 
  families,
  clx='',
  itemClx='',
  itemOptions,
  mediaConstraint=DEFAULT_CONSTRAINT,
  mobile=false, // not relavant to any children
}) => {
   
  const cmmc = useCommerce()
  const elbaApiRef = useRef<CarouselApi | undefined>(undefined)
  const itemsRef = useRef<LineItem[] | undefined>(undefined)
  const dontRespondRef = useRef<boolean>(false)
  const [changeMeToRerender, setChangeMeToRerender] = useState<boolean>(false)
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
      if (item && item.familyId !== cmmc.currentFamily?.id) {
        cmmc.setCurrentFamily(item.familyId)
      }
    }
    dontRespondRef.current = false
  }, [])

  useEffect(() => {

    itemsRef.current = families.map((fam) => (fam.products as LineItem[])).flat()
    setChangeMeToRerender(!changeMeToRerender)

    return reaction(
      () => (cmmc.currentItem),
      (item) => {
        if (elbaApiRef.current) {
          const index = itemsRef.current?.findIndex((_item: LineItem) => (_item.sku === item?.sku))  
          if (index && index !== -1) {
              // no need to sync family, since ui only allows selecting within a family            
            dontRespondRef.current = true
            elbaApiRef.current.scrollTo(index) 
          }
        }
      }  
    )
  }, [])

/*
  const onScrollIndexChange = (index: number) => {
    dontRespondRef.current = true
    cmmc.setCurrentItem(items?.[index].sku)
    elbaApiRef.current?.scrollTo(index) 
  }
*/

  const MyTitleAndByline: React.FC<{clx?: string}> = observer(({
    clx=''
  }) => {
    const { familyTitle, showFamilyByline } = accessOptionValues(itemOptions)
    const title = (familyTitle === 'none' ? 
      undefined 
      : 
      (familyTitle === 'long' ? 
        cmmc.currentFamily?.title 
        : 
        (cmmc.currentFamily?.titleShort ?? cmmc.currentFamily?.title)
      ) 
    )
    const byline = (familyTitle !== 'none') && showFamilyByline ? cmmc.currentFamily?.byline :  undefined
    return ( <TitleAndByline clx={clx} title={title} byline={byline}/> )
  })

  const ItemInfo: React.FC = observer(() => {

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

    return (cmmc.currentItem && (
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
    ))
  })

  return ( 
    <div className={cn('w-full flex flex-col items-center', clx)}>
      <MyTitleAndByline />
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
}

export {
  AllVariantsCarousel as default 
}
