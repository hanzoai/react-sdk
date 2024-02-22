'use client'
import React from 'react'
import Image from 'next/image'
import { observer } from 'mobx-react'

import { cn } from '@hanzo/ui/util'

import { formatPrice } from '../../util'
import type { LineItem } from '../../types'

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
  item: LineItem
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  className,
  ...props
}: ProductCardProps) => {

  //const commerce = useCommerce()

  const Buttons: React.FC = observer(() => {
    if (item.quantity === 0) {
      return (
        <Button
          aria-label={'Add a ' + item.product.title + ' to cart'}
          size='sm'
          className='h-8 rounded-sm text-muted flex flex-row'
          onClick={item.increment}
        >
          <Icons.plus className='h-8 w-8 text-muted' aria-hidden='true'/>
          Add
        </Button>
      )
      }
      return (
        <div className='flex flex-row'>
          <Button
            aria-label={'Remove a ' + item.product.title + ' from the cart'}
            size='sm'
            className='h-8 rounded-sm'
            onClick={() => {item.decrement}
          >
          {(item.canDecrement) ? (
            <Icons.minus className='h-8 w-8 text-muted' aria-hidden='true'/>
          ) : (
            <Icons.trash className='h-8 w-8 text-muted' aria-hidden='true'/>
          )}
          </Button>
            <span className='text-muted'>{item.quantity}</span>
          <Button
            aria-label={'Add another ' + item.product.title + ' to the cart'}
            size='sm'
            className='h-8 rounded-sm'
            onClick={() => {item.increment}}
          >
            <Icons.plus className='h-8 w-8 text-muted' aria-hidden='true'/>
          </Button>
        </div>
      )
  })

  const Image_: React.FC = () => {
    if (typeof item.product.img === 'string') {
      return (
        <Image
          src={item.product.img}
          alt={item.product.title}
          className='object-cover w-full h-auto'
          loading='lazy'
          width={700}
          height={700}
        />
      )
    }
    const {dim, src, alt} = (item.product.img as ImageDef)

    return (
      <Image 
        width={dim.w}
        height={dim.h}
        src={src}
        alt={alt ?? item.product.title}
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
            {item.product.img ? (
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
            {item.product.title}
          </CardTitle>
          <CardDescription className='line-clamp-2'>
            {formatPrice(item.product.price)}
          </CardDescription>
        </CardContent>
      <CardFooter className='p-4'>
        <Buttons />
      </CardFooter>
    </Card>
  )
}

export default ProductCard
