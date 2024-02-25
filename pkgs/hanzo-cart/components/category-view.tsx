'use client'
import React, { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'

import type { ImageDef } from '@hanzo/ui/types'
import { cn } from '@hanzo/ui/util'
import { Label, RadioGroup, RadioGroupItem } from '@hanzo/ui/primitives'

import { formatPrice } from '../util'
import { Icons } from './Icons'

import QuantityWidget from './quantity-widget'
import { useCommerce } from '../service'
import type { Category, LineItem } from '../types'
import { autorun } from 'mobx'

const TS = '-'  // token separator
const DEC = '_' // decimal substitute

const amountLabelFromSKU = (sku: string): string => {
  const mainTokens = sku.split(TS)
  const tCount = mainTokens.length
  const amount = mainTokens[tCount - 2].includes(DEC) ? 
    mainTokens[tCount - 2].split(DEC).join('.') 
    : 
    mainTokens[tCount - 2]
  
  const unit = mainTokens[tCount - 1].toLowerCase()
  return amount.toLowerCase() + unit
}


const CategoryView: React.FC<React.HTMLAttributes<HTMLDivElement> & {
}> = ({
  className,
  ...props
}) => {

  const [sizeItem, setSizeItem] = useState<LineItem | undefined>(undefined)

  const c = useCommerce()
  const cat = (): Category => (c.specifiedCategories[c.specifiedCategories.length - 1])

  useEffect(() => {
    return autorun(() => {
      const item = c.specifiedItems.length > 0 ? c.specifiedItems[0] : undefined
      setSizeItem(item)
    })
  }, [])

  const CategoryImage: React.FC<{className?: string}> = ({
    className=''
  }) => {

    if (!cat().img) {
      return (
        <div
          aria-label='Placeholder'
          role='img'
          aria-roledescription='placeholder'
          className={cn('h-60 flex items-center justify-center', className)}
        >
          <Icons.barcode className='h-9 w-9 text-muted' aria-hidden='true' />
        </div>
      )
    } 

    let src: string 
    let alt: string
    if (typeof cat().img === 'string') {
      src = cat().img as string
      alt = cat().title
    }
    else {
      const {dim: _dim, src: _src, alt: _alt} = (cat().img as ImageDef)
      alt = _alt ?? cat().title
      src = _src
    }

    return (
      <div className={cn('flex flex-col justify-start', className)}>
        <div className={cn('w-full border rounded-xl p-6 ')}>
          <div className={cn('w-full aspect-square  relative')}>
            <Image 
              src={src}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 20vw"
              alt={alt}
              className=''
              loading='lazy'
              style={{ objectFit: 'contain'}}
            />
          </div>
        </div>
      </div>
    )
  }


  const AvailableAmounts: React.FC<{className?: string}> = ({
    className=''
  }) => { 
    const onSelection = (sku: string) => {
      const selectedItem = c.specifiedItems.find((item) => (item.product.sku === sku))
      if (selectedItem) {
        setSizeItem(selectedItem)
      }
    }

    return c.specifiedItems.length > 1 ? (
      <div id='CV_AVAIL_AMOUNTS' className={cn('w-full md:w-auto flex flex-col justify-start items-center gap-8', className)}>
        <div className='w-full flex flex-col justify-start items-center'>
          <h6 className='text-center font-semibold'>Available sizes</h6>
          <div className='h-[1px] w-pr-70 bg-muted-3' />
        </div>
        <RadioGroup className='block columns-3 gap-2 lg:columns-2 lg:gap-6 w-full lg:auto' onValueChange={onSelection} value={sizeItem?.product.sku ?? undefined}>
        {c.specifiedItems.map((item) => (
          <div className="flex flex-row gap-2 items-center mb-3">
            <RadioGroupItem value={item.product.sku} id={item.product.sku} />
            <Label htmlFor={item.product.sku}>{amountLabelFromSKU(item.product.sku) + ', ' + formatPrice(item.product.price)}</Label>
          </div>
        ))}
        </RadioGroup>
      </div>
    ) : null
  }

  const InfoArea: React.FC<{className?: string}> = ({
    className=''
  }) => {

    return (
      <div className={className}>
        <div className='flex flex-col justify-start items-center mb-6'>
          <h3 className='text-lg lg:text-xl font-heading text-center'>
            <span className='hidden md:inline lg:hidden'>
            {c.specifiedCategories.map((cat, i) => (<p>{cat.title}</p>))}
            </span>
            <span  className='inline md:hidden lg:inline'>
              {c.specifiedCategories.map((cat, i) => (cat.title)).join(', ')}
            </span>
          </h3>
          {sizeItem ? (
            <h6 className='text-center font-semibold'>
              {amountLabelFromSKU(sizeItem.product.sku) + ': ' + formatPrice(sizeItem.product.price)}
            </h6>
          ) : ''}
        </div>
        <p className='text-base lg:text-lg mb-6'>{cat().desc}</p>
      </div>
    )
  }

  return (
    <div id='CV_OUTERMOST' >
      <div /* id='CV_OUTER' */ className={cn('w-full flex flex-row justify-between items-stretch gap-6', className)} {...props}>
        <div /* id='CV_IMAGE_COL' */ className='w-pr-33 relative'>
          <CategoryImage className='' />
        </div>
        <div /* id='CV_CONTENT_COL' */ className='w-pr-66' >
          <div /* id='CV_CONTENT' */ className='flex flex-col gap-2.5 '>
            <InfoArea className=''/>
          </div>
          <div /* id='CV_CTA_AREA_BIG' */  className='hidden lg:flex p-4 flex-col justify-start items-center gap-6'>
            <AvailableAmounts />
            {sizeItem ? (<QuantityWidget size='default' item={sizeItem}/>) : null }
          </div>
        </div>
      </div>
      <div /* id='CV_CTA_AREA_COMPACT' */ className='lg:hidden flex p-4 flex-col justify-start items-center gap-6'>
        <AvailableAmounts />
        {sizeItem ? (<QuantityWidget size='default' item={sizeItem}/>) : null }
      </div>
    </div>
  )
}

export default CategoryView
