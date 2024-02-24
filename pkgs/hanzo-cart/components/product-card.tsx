import React from 'react'
import Image from 'next/image'

import { 
  AspectRatio, 
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
import type { LineItem } from '../types'
import { Icons } from './Icons'

import QuantityWidget from './quantity-widget'

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: LineItem
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  className,
  ...props
}) => {

  const ProductImage: React.FC<{className?: string}> = ({className=''}) => {
    if (typeof item.product.img === 'string') {
      return (
        <Image
          src={item.product.img}
          alt={item.product.title}
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
    const {dim, src, alt} = (item.product.img as ImageDef)

    return (
      <Image 
  //      width={dim.w}
  //      height={dim.h}
        src={src}
        fill
        alt={alt ?? item.product.title}
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
      className={cn('max-h-[360px] lg:min-w-[200px] max-w-[260px] overflow-hidden', className)}
      {...props}
    >
      <CardHeader className='w-full border-b p-6 min-h-[180px] max-h-[240px] relative'>
      {item.product.img ? (
        <ProductImage className='p-6' />
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
        <CardTitle className='text-base flex flex-col justify-start items-center line-clap-3'>
          {item.product.title.split(', ').map((e, i) => (<p key={i}>{e}</p>))}
          <p className='mt-1 font-semibold'>{formatPrice(item.product.price)}</p>
        </CardTitle>
      </CardContent>
      <CardFooter className='p-4 flex flex-row justify-center'>
        <QuantityWidget item={item}/>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
