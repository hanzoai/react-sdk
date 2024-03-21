import Spline from '@splinetool/react-spline'
import Image from 'next/image'

import type { LineItem } from '../../types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@hanzo/ui/primitives'

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
        {items.map(({title, img, video}, index) => (
          <CarouselItem key={index}>
            <div className='flex aspect-square items-center justify-center p-6'>
              {video ? (
                <Spline
                  scene={video}
                  className='!aspect-[12/10] pointer-events-none !w-auto !h-auto'
                />
              ) : (
                <Image
                  src={img ?? ''}
                  alt={title + ' image'}
                  height={250}
                  width={250} 
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
