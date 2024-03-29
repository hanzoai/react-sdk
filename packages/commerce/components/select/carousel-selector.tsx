import React from 'react'

import Spline from '@splinetool/react-spline'

import type { Dimensions } from '@hanzo/ui/types'
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

import type { ItemSelectorProps } from '../../types'

interface CarouselItemSelectorPropsExt {
  constrainTo: Dimensions
  options?: CarouselOptionsType 
  noSelection?: boolean // "display only" mode
}
  
const CarouselItemSelector: React.FC<ItemSelectorProps> = ({ 
  items,
  clx='',
  itemClx='',
  ext={
    options: {},
    constrainTo: {w: 250, h: 250} 
  } satisfies CarouselItemSelectorPropsExt
}) => {

  const { options, constrainTo: cnst } = ext

  return ( 
    <Carousel options={options} className={cn('px-2', clx)} >
      <CarouselContent>
      {items.map(({title, img, video, animation}, index) => (
        <CarouselItem key={index} className={cn('p-2 flex flex-row justify-center items-center', itemClx)}>
        {animation ? ( // Order of precedence of visuals: 3D > MP4 > Image
          <Spline
            scene={animation}
            className='pointer-events-none' // !aspect-[12/10] 
            style={{
              width: (6/5 * (typeof cnst.h === 'number' ? cnst.h as number : parseInt(cnst.h as string)) ),
              height: cnst.h
            }}
          />
        ) : video ? (
          <VideoBlockComponent
            constraint={cnst}
            block={{blockType: 'video', ...video} satisfies VideoBlock as Block}
          />
        ) : (
          <ImageBlockComponent
            block={{
              blockType: 'image',
              src: img ?? '',
              alt: title + ' image',
              dim: cnst
            } satisfies ImageBlock as Block} 
            className='m-auto'
          />
        )}
        </CarouselItem>
      ))}
      </CarouselContent>
      <CarouselPrevious className='left-1'/>
      <CarouselNext className='right-1'/>
    </Carousel>
  )
}

export {
  type CarouselItemSelectorPropsExt,
  CarouselItemSelector as default 
}
