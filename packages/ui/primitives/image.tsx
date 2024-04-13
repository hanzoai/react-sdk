import React from 'react'
import NextImage from 'next/image'

import type { ImageDef, Dimensions, MediaTransform } from '../types'
import { constrain, cn, spreadToTransform } from '../util'

const Image: React.FC<{
  def: ImageDef
  constrainTo?: Dimensions
  transform?: MediaTransform
  fullWidth?: boolean
  className?: string
  preload?: boolean
}> = ({
  def,
  constrainTo,
  transform={},
  fullWidth=false,
  className='',
  preload=false
}) => {
  
  const {
    src, 
    alt: _alt, 
    dim, 
    sizes,
    svgFillClass: _svgFillClass,
  } = def

  const toSpread: any = {}
  if (fullWidth) {
    toSpread.style = {
      width: '100%',
      height: 'auto',
      ...spreadToTransform(transform)
    }
    if (constrainTo) {
      toSpread.style.maxWidth = constrainTo.w  
      toSpread.style.maxHeight = constrainTo.h  
    }
  }
  else {
    const resolved = constrainTo ? constrain(dim, constrainTo) : dim
    toSpread.width = resolved.w
    toSpread.height = resolved.h
    toSpread.style = {...spreadToTransform(transform)}
  } 

  if (sizes) {
    toSpread.sizes = sizes
  }

    // Note: cannot be spread (a Next thing)
  let alt: string
  if (_alt) {
    alt = _alt
  }
  else {
    const tokens = src.split('/')
      // Something remotely meaningful
    alt = (tokens.length > 0) ? tokens[tokens.length - 1] : src
  }

  const svgFillClass = _svgFillClass ?? ''

  return (fullWidth) ? (
    <div className='relative flex flex-col items-center justify-center w-full'>
      <NextImage 
        data-vaul-no-drag 
        src={src} 
        alt={alt} 
        {...toSpread} 
        priority={preload} 
        loading={preload ? 'eager' : 'lazy'} 
        className={cn(svgFillClass, className)}
      />
    </div>
  ) : (
    <NextImage 
      src={src} 
      alt={alt} 
      data-vaul-no-drag 
      {...toSpread} 
      priority={preload} 
      loading={preload ? 'eager' : 'lazy'} 
      className={cn(svgFillClass, className)}
    />   
  )
}

export default Image
