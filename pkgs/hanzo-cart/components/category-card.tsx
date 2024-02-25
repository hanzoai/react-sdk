'use client'
import React, { useState } from 'react'
import Image from 'next/image'

import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hanzo/ui/primitives'
import type { ImageDef } from '@hanzo/ui/types'
import { cn } from '@hanzo/ui/util'

import { formatPrice } from '../util'
import { Icons } from './Icons'

import QuantityWidget from './quantity-widget'
import { useCommerce } from '../service'
import type { Category, LineItem } from '../types'


const CategoryCard: React.FC<React.HTMLAttributes<HTMLDivElement> & {
}> = ({
  className,
  ...props
}) => {

  


  const [sizeItem, setSizeItem] = useState<LineItem | undefined>(undefined)

  const c = useCommerce()

  c.specifiedCategories

  const CategoryImage: React.FC<{className?: string}> = ({className=''}) => {
    if (typeof c.specifiedCategories[1].img === 'string') {
      return (
        <Image
          src={c.specifiedCategories[1].img}
          alt={c.specifiedCategories[1].title}
          className={className}
          loading='lazy'
//          width={700}
//          height={700}
          fill
          style={{
            objectFit: 'contain',
          }}
        />
      )
    }
    const {dim, src, alt} = (c.specifiedCategories[1].img as ImageDef)

    return (
      <Image 
  //      width={dim.w}
  //      height={dim.h}
        src={src}
        fill
        alt={alt ?? c.specifiedCategories[1].title}
        className={className}
        loading='lazy'
        style={{
          objectFit: 'contain',
        }}
    />
    )
  }

  return (
    <Card
      className={cn('lg:min-w-[400px] lg:max-w-[600px] overflow-hidden', className)}
      {...props}
    >
      <CardHeader className='w-full border-b p-6 min-h-[180px] max-h-[240px] relative'>
      {c.specifiedCategories[1].img ? (
        <CategoryImage className='p-6' />
      ) : (
          <div
            aria-label='Placeholder'
            role='img'
            aria-roledescription='placeholder'
            className='flex h-full items-center justify-center bg-secondary'
          >
            <Icons.barcode className='h-9 w-9 text-muted' aria-hidden='true' />
          </div>
      )}
      </CardHeader>
      <CardContent className='grid gap-2.5 p-4'>
        <CardTitle className='text-sm sm:text-base flex flex-col justify-start items-center line-clap-3'>
        {c.specifiedCategories.map((cat, i) => (<p key={i}>{cat.title}</p>))}
          {/*<p className='mt-1 font-semibold'>{formatPrice(item.product.price)}</p>*/}
        </CardTitle>
      </CardContent>
      <CardFooter className='p-4 flex flex-row justify-center'>
        {/*<QuantityWidget item={item}/> */}
        <h3>Add +</h3>
      </CardFooter>
    </Card>
  )
  
}

//{cat.title.split(', ').map((e, i) => (<p key={i}>{e}</p>))}


export default CategoryCard
