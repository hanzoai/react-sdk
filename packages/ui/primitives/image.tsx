import React from 'react'
import NextImage from 'next/image'

import type { ImageDef } from '../types'
import { resolveDimensions, cn } from '../util'

const Image: React.FC<{
  def: ImageDef
  constrainTo?: {w: number, h: number}
  fullWidth?: boolean
  className?: string
}> = ({
  def,
  constrainTo,
  fullWidth=false,
  className='',
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
    }
    if (constrainTo) {
      toSpread.style.maxWidth = constrainTo.w  
      toSpread.style.maxHeight = constrainTo.h  
    }
  }
  else {
    const resolved = resolveDimensions(dim, constrainTo)
    toSpread.width = resolved.w
    toSpread.height = resolved.h
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
    alt = (tokens.length > 0) ? tokens[tokens.length] : src
  }

  const svgFillClass = _svgFillClass ?? ''

  return (fullWidth) ? (
    <div className='relative flex flex-col items-center w-full'>
      <NextImage src={src} alt={_alt} {...toSpread} className={cn(svgFillClass, className)}/>
    </div>
  ) : (
    <NextImage src={src} alt={_alt} {...toSpread} className={cn(svgFillClass, className)}/>   
  )
}

export default Image

