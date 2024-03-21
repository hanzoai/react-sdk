import Spline from '@splinetool/react-spline'

import {
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
  type Block
} from '@hanzo/ui/blocks'

import type { LineItem } from '../../types'

// Carousel content hierarchy: 3D > MP4 > Image
const ProductsCarousel: React.FC<{
  items: LineItem[]
}> = ({ 
  items,
}) => {
  return (
    <Carousel
      options={{
        loop: true
      }}
      className='w-full max-w-sm mx-auto px-2'
    >
      <CarouselContent>
        {items.map(({title, img, video, animation}, index) => (
          <CarouselItem key={index}>
            <div className='flex aspect-square items-center justify-center p-6'>
              {animation ? (
                <Spline
                  scene={animation}
                  className='!aspect-[12/10] pointer-events-none !w-auto !h-auto'
                />
              ) : video ? (
                <VideoBlockComponent block={video}/>
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
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default ProductsCarousel
