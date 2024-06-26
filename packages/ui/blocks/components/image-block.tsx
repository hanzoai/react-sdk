import React from 'react'
import Image from 'next/image'

import type { Dimensions } from '../../types'
import type { ImageBlock } from '../def'
import { constrain, containsToken, cn } from '../../util'

import type BlockComponentProps from './block-component-props'


const ImageBlockComponent: React.FC<BlockComponentProps & {
  constraintTo?: Dimensions
}> = ({
  block,
  className='',
  agent,
  constraintTo
}) => {
  
  if (block.blockType !== 'image') {
    return <>image block required</>
  }

  const {
    src, 
    alt, 
    dim, 
    props, 
    sizes,
    fullWidthOnMobile, 
    svgFillClass,
    specifiers
  } = block as ImageBlock

  const specified = (s: string): boolean => (containsToken(specifiers, s)) 

  const toSpread: any = {}
  if (props?.fill === undefined) {
    const resolved = constraintTo ? constrain(dim, constraintTo) : dim
    toSpread.width = resolved.w
    toSpread.height = resolved.h
  } 

  let _alt: string
  if (alt) {
    _alt = alt
  }
  else {
    const tokens = src.split('/')
      // Something remotely meaningful
    _alt = (tokens.length > 0) ? tokens[tokens.length] : src
  }

  const _svgFillClass = svgFillClass ?? ''

    // TODO: use two elements with 'md:hidden' for 3/4 size
    // https://nextjs.org/docs/app/building-your-application/optimizing/images#responsive
  if (agent === 'phone' ) {
    if (specified('mobile-full-width') || fullWidthOnMobile) {
      const toSpread: any =  {
        style: {
          width: '100%',
          height: 'auto',
          maxWidth: '420px'
        },
        sizes: '100vw',
      }
        // only for aspect ratio and to satisfy parser
      toSpread.width = dim.w
      toSpread.height = dim.h

      return (
        <div className='flex flex-col items-center w-full'>
          <Image src={src} alt={_alt} {...toSpread} className={cn(_svgFillClass, className)}/>
        </div>
      )
    }
      // TODO use constraint
    else if (!specified('mobile-no-scale')) {
      if (props?.style?.width === 'auto' && typeof props.style.height === 'number' ) {
        props.style.height = props.style.height *.75 
      }
      else if (props?.style?.height === 'auto' && typeof props?.style?.width === 'number' ) {
        props.style.width = props.style.width *.75 
      }
      else if (props?.style && !props?.style.width) {
        toSpread.width = dim.w * .75
        toSpread.height = dim.h * .75
      }
    }
  }
  if (sizes) {
    toSpread.sizes = sizes
  }

  const right = containsToken(specifiers, 'right')
  const center = containsToken(specifiers, 'center')

  const alignSelfClx = right ? 'self-end' : (center ? 'self-center' : 'self-start')

  return (props?.fill) ? (
    <div className='relative w-full h-full'>
      <Image src={src} alt={_alt} {...toSpread} {...props} className={cn(_svgFillClass, 'max-w-[70vw] mx-auto', className)}/>
    </div>
  ) : (
    <Image src={src} alt={_alt} {...toSpread} {...props} className={cn(alignSelfClx, _svgFillClass, 'max-w-[70vw] mx-auto', className)}/>   
  )
}

export default ImageBlockComponent

