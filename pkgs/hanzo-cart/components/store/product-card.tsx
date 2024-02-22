'use client'
import React from 'react'
import Image from 'next/image'
import { observer } from 'mobx-react'

import { cn } from '@hanzo/ui/util'

import { formatPrice } from '../../util'
import type { Product } from '../../types'

import { 
  AspectRatio, 
  Button, 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hanzo/ui/primitives'

import { Icons } from '../../common/Icons'

import { useCommerce } from '../../service/commerce'
import type { ImageDef } from '@hanzo/ui/types'

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = observer(({
  product,
  className,
  ...props
}: ProductCardProps) => {

  const commerce = useCommerce()

  const count = commerce.getQuantity(product.id)

  const Buttons: React.FC = () => {
    if (count === 0) {
      return (
        <Button
          aria-label={'Add a ' + product.title + ' to cart'}
          size='sm'
          className='h-8 rounded-sm text-muted flex flex-row'
          onClick={() => {commerce.incrementQuantity(product.id)}}
        >
          <Icons.plus className='h-8 w-8 text-muted' aria-hidden='true'/>
          Add
        </Button>
      )
      }
      return (
        <div className='flex flex-row'>
          <Button
            aria-label={'Remove a ' + product.title + ' from the cart'}
            size='sm'
            className='h-8 rounded-sm'
            onClick={() => {commerce.decrementQuantity(product.id)}}
          >
          {(count > 1) ? (
            <Icons.minus className='h-8 w-8 text-muted' aria-hidden='true'/>
          ) : (
            <Icons.trash className='h-8 w-8 text-muted' aria-hidden='true'/>
          )}
          </Button>
            <span className='text-muted'>{count}</span>
          <Button
            aria-label={'Add another ' + product.title + ' to the cart'}
            size='sm'
            className='h-8 rounded-sm'
            onClick={() => {commerce.incrementQuantity(product.id)}}
          >
            <Icons.plus className='h-8 w-8 text-muted' aria-hidden='true'/>
          </Button>
        </div>
      )
  }

  const Image_: React.FC = () => {
    if (typeof product.img === 'string') {
      <Image
        src={product.img}
        alt={product.title}
        className='object-cover w-full h-auto'
        loading='lazy'
      />
    }
    const {dim, src, alt} = (product.img as ImageDef)

    return (
      <Image 
        width={dim.w}
        height={dim.h}
        src={src}
        alt={alt ?? product.title}
        className='w-full w-full h-auto'
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
            {product.img ? (
              <Image_ />
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
            {product.title}
          </CardTitle>
          <CardDescription className='line-clamp-2'>
            {formatPrice(product.price)}
          </CardDescription>
        </CardContent>
      <CardFooter className='p-4'>
        <Buttons />
      </CardFooter>
    </Card>
  )
})

export default ProductCard
