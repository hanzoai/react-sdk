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

  const ProductImage: React.FC = () => {
    if (typeof item.product.img === 'string') {
      return (
        <Image
          src={item.product.img}
          alt={item.product.title}
          className=''
          loading='lazy'
          fill
          //width={700}
          //height={700}
        />
      )
    }
    const {dim, src, alt} = (item.product.img as ImageDef)

    return (
      <Image 
        //width={dim.w}
        //height={dim.h}
        src={src}
        fill
        alt={alt ?? item.product.title}
        className=''
        loading='lazy'
    />
    )
  }

  return (
    <Card
      className={cn('h-full overflow-hidden rounded-sm', className)}
      {...props}
    >
        <CardHeader className='border-b p-0'>
          <AspectRatio ratio={4 / 3}>
            {item.product.img ? (
              <ProductImage />
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
          </AspectRatio>
        </CardHeader>
        <CardContent className='grid gap-2.5 p-4'>
          <CardTitle className='line-clamp-1 text-base'>
            {item.product.title.split(', ').map((e, i) => (<p key={i}>{e}</p>))}
          </CardTitle>
          <CardDescription className='line-clamp-2'>
            {formatPrice(item.product.price)}
          </CardDescription>
        </CardContent>
        <CardFooter className='p-4 flex flex-row justify-center'>
          <QuantityWidget item={item}/>
        </CardFooter>
    </Card>
  )
}

export default ProductCard
