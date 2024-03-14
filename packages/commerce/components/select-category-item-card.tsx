'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'
import { Skeleton } from '@hanzo/ui/primitives'

import type { ItemSelector } from '../types'
import { formatPrice } from '../util'

import AddToCartWidget from './add-to-cart-widget'
import CategoryItemRadioSelector from './category-item-radio-selector'
import CategoryItemIOSWheelSelector from './category-item-ios-wheel-selector'

const SelectCategoryItemCard: React.FC<React.HTMLAttributes<HTMLDivElement> & ItemSelector & {
  isLoading?: boolean
  mobile?: boolean
}> = ({
  category,
  selectedItemRef: selItemRef,
  selectSku,
  className, 
  isLoading = false, 
  mobile = false, 
  ...props
}) => {

  const soleOption = category.products.length === 1

  const SelectProductComp: React.FC<{ className?: string }> = observer(({ className = '' }) => {

    if (soleOption) return null
    const mobilePicker = (mobile && category.products.length > 6) 

    return (
      <div /* id='CV_AVAIL_AMOUNTS' */ className={cn(
        'sm:w-pr-80 sm:mx-auto md:w-full  flex flex-col justify-start items-center',
        (mobilePicker ? 'gap-4' : 'gap-8'),
        className
      )}>
        <div className='w-full flex flex-col justify-start items-center'>
          <h6 className='text-center font-semibold'>Available options</h6>
          <div className={'h-[1px] bg-muted-3 ' + (mobilePicker ?  'w-pr-55' :  'w-pr-60') } />
        </div>
        {mobilePicker ? (
          <CategoryItemIOSWheelSelector
            category={category}
            selectedItemRef={selItemRef}  
            selectSku={selectSku}
            height={180}
            itemHeight={30}
            outerClx='mb-4'
          />
        ) : (
          <CategoryItemRadioSelector 
            category={category}
            selectedItemRef={selItemRef}  
            selectSku={selectSku}
            groupClx='block columns-2 gap-4'
            itemClx='flex flex-row gap-2 items-center mb-2.5'
          />
        )}
      </div>
    )
  })

  const AddToCartComp: React.FC<{ className?: string }> = observer(({ className = '' }) => (
      // TODO disable if nothing selected
    (selItemRef.item && !isLoading) && (
      <AddToCartWidget size='default' item={selItemRef.item} className={className}/>
    ) 
  ))

  const TitleArea: React.FC<{ className?: string }> = observer(({ className = '' }) => (

    isLoading ? (<Skeleton className={'h-12 w-pr-80 mx-auto ' + className} />) : (

      <div className={cn('flex flex-col justify-start items-center', className)}>
        <h3 className='text-base md:text-lg lg:text-2xl font-nav text-center'>
          <span className='xs:block md:hidden'>
            {category.title.split(', ').map((s, i) => (<p key={i}>{s}</p>))}
          </span>
          <span className='xs:hidden md:inline '>
            {category.title}
          </span>
        </h3>
        {selItemRef.item?.sku ? (
          <h6 className='text-center font-semibold'>
            {(soleOption ? '' : (selItemRef.item.titleAsOption + ': ')) + formatPrice(selItemRef.item.price)}
          </h6>
        ) : ''}
      </div>
  )))

  return mobile ? (
    <div /* id='CV_OUTER' */ 
      className={cn(
        'w-full h-[calc(100svh-96px)] max-h-[700px] flex flex-col justify-between ' + 
        'items-stretch gap-[4vh] mt-[2vh] pb-[6vh]', 
        className
      )} 
      {...props}
    >
      <TitleArea className='grow pt-3 mb-0' />
      <SelectProductComp className='mb-[3vh]' />
      <AddToCartComp className='w-pr-70 mx-auto' />
    </div>
  ) : (
    <div className={cn('', className)} {...props}>
      <TitleArea className='' />
      <div className='flex flex-col justify-start items-center gap-4'>
        <SelectProductComp />
        <AddToCartComp className='' />
      </div>
    </div>
  )
}


export default SelectCategoryItemCard