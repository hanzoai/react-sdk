import React from 'react'

import Spline from '@splinetool/react-spline'

import { cn } from '@hanzo/ui/util'

import {
  type CarouselOptionsType,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@hanzo/ui/primitives'

import {
  VideoBlockComponent,
  ImageBlockComponent,
  type ImageBlock,
  type Block,
  type VideoBlock
} from '@hanzo/ui/blocks'

import type { LineItem } from '../types'

  // Order of precedence of visuals: 3D > MP4 > Image
const ItemCarousel: React.FC<{
  items: LineItem[]
  options?: CarouselOptionsType 
  className?: string
  itemClx?: string  
}> = ({ 
  items,
  options,
  className='',
  itemClx=''
}) => ( 
  // className: 'w-full max-w-sm mx-auto 
  // itemClx:  'flex aspect-square items-center justify-center '
  <Carousel options={options} className={cn('px-2', className)} >
    <CarouselContent>
    {items.map(({title, img, video, animation}, index) => (
      <CarouselItem key={index} className={cn('p-2', itemClx)}>
      {animation ? (
        <Spline
          scene={animation}
          className='!aspect-[12/10] pointer-events-none !w-auto !h-auto'
        />
      ) : video ? (
        <VideoBlockComponent
          block={{blockType: 'video', ...video} satisfies VideoBlock as Block}
        />
      ) : (
        <ImageBlockComponent
          block={{
            blockType: 'image',
            src: img ?? '',
            alt: title + ' image',
            dim: { w: 250, h: 250 }
          } satisfies ImageBlock as Block} 
          className='m-auto'
        />
      )}
      </CarouselItem>
    ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
)

export default ItemCarousel
