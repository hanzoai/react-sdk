'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { cn } from '@hanzo/ui/util'
import { Label, RadioGroup, RadioGroupItem } from '@hanzo/ui/primitives'

import { formatPrice } from '../util'
import { Icons } from './Icons'

import QuantityWidget from './quantity-widget'
import type { Category, LineItem } from '../types'

const CategoryView: React.FC<React.HTMLAttributes<HTMLDivElement> & {
  category: Category
  agent?: string
}> = ({
  category,
  className,
  agent,
  ...props
}) => {

  const [selectedItem, setSelectedItem] = useState<LineItem >(category.products[0] as LineItem)

  const CategoryImage: React.FC<{className?: string}> = ({
    className=''
  }) => {

    if (!category.img) {
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

    return (
      <div className={cn('flex flex-col justify-start', className)}>
        <div className={cn('w-full border rounded-xl p-6 ')}>
          <div className={cn('w-full aspect-square  relative')}>
            <Image 
              src={category.img!}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 20vw"
              alt={category.title}
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

      const selectedItem = category.products.find((item) => (item.sku === sku))
      if (selectedItem) {
        setSelectedItem(selectedItem as LineItem)
      }
    }

    const soleOption = category.products.length === 1

    return (
      <div /* id='CV_AVAIL_AMOUNTS' */ className={cn(
        'w-full md:w-auto flex flex-col justify-start items-center', 
        (soleOption ? 'gap-2' : 'gap-8'),
        className
      )}>
        <div className='w-full flex flex-col justify-start items-center'>
          <h6 className='text-center font-semibold'>{`Available size${soleOption ? '' : 's'}`}</h6>
          <div className='h-[1px] w-pr-70 bg-muted-3' />
        </div>
        {soleOption ? (
          <p>{category.products[0].titleAsOption}</p>
        ) : (
          <RadioGroup className='block xs:columns-2 xs:px-3 columns-3 gap-2 lg:columns-2 lg:gap-6 w-full lg:auto' onValueChange={onSelection} value={selectedItem?.sku ?? undefined}>
          {category.products.map((item) => (
            <div className="flex flex-row gap-2 items-center mb-3 xs:mb-5" key={item.sku}>
              <RadioGroupItem value={item.sku} id={item.sku} />
              <Label htmlFor={item.sku}>{item.titleAsOption + ', ' + formatPrice(item.price)}</Label>
            </div>
          ))}
          </RadioGroup>
        )}

      </div>
    )
  }

  const TitleArea: React.FC<{className?: string}> = ({
    className=''
  }) => (
    <div className={cn('flex flex-col justify-start items-center mb-6', className)}>
      <h3 className='text-lg lg:text-xl font-heading text-center'>
        <span className='xs:inline sm:hidden md:inline lg:hidden'>
          {category.title.split(', ').map((s, i) => (<p key={i}>{s}</p>)) }
        </span>
        <span  className='xs:hidden sm:inline md:hidden lg:inline'>
          {category.title}
        </span>
      </h3>
      {selectedItem ? (
        <h6 className='text-center font-semibold'>
          {selectedItem.titleAsOption + ': ' + formatPrice(selectedItem.price)}
        </h6>
      ) : ''}
    </div>
  )

  const Desc: React.FC<{className?: string}> = ({
    className=''
  }) => (
    <p className={cn('text-base lg:text-lg mb-6 xs:mb-0', className)}>{category.desc}</p>
  )

  return agent === 'phone' ? (
    <div /* id='CV_OUTER' */ className={cn('w-full flex flex-col justify-start items-stretch gap-4 mt-2', className)} {...props}>
      <div /* id='CV_TITLE_AND_IMAGE_ROW' */ className='flex flex-row justify-between items-start w-full'>
        <CategoryImage className='w-pr-33' />
        <TitleArea className='grow pt-3 mb-0'/>
      </div>
      <Desc className='' />
      <AvailableAmounts className='mb-2'/>
      {selectedItem ? (
        <QuantityWidget size='default' wide item={selectedItem} className='w-pr-80 mx-auto'/>
      ) : null }
    </div>
  ) : (
    <div /* id='CV_OUTERMOST' */ >
      <div /* id='CV_OUTER' */ className={cn('w-full flex flex-row justify-between items-stretch gap-6', className)} {...props}>
        <div /* id='CV_IMAGE_COL' */ className='w-pr-33 relative'>
          <CategoryImage className='' />
        </div>
        <div /* id='CV_CONTENT_COL' */ className='w-pr-66' >
          <div /* id='CV_CONTENT' */ className='flex flex-col gap-2.5 '>
            <TitleArea className=''/>
            <Desc className='' />
          </div>
          <div /* id='CV_CTA_AREA_BIG' */  className='hidden lg:flex p-4 flex-col justify-start items-center gap-6'>
            <AvailableAmounts />
            {selectedItem ? (<QuantityWidget size='default' item={selectedItem}/>) : null }
          </div>
        </div>
      </div>
      <div /* id='CV_CTA_AREA_COMPACT' */ className='lg:hidden flex p-4 flex-col justify-start items-center gap-6'>
        <AvailableAmounts />
        {selectedItem ? (<QuantityWidget size='default' item={selectedItem}/>) : null /* TO DO.. maybe the add widget disabled*/}
      </div>
    </div>
  )
}

export default CategoryView
