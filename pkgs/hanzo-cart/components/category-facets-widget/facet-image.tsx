import React from 'react'
import Image from 'next/image'

import type { CategoryFacetSpec } from '../../types'

const ICON_SIZE = 16
const SVG_MULT = 1.5

const FacetImage: React.FC<{
  spec: CategoryFacetSpec
}> = ({
  spec
}) => {
  if (!spec.img) {
    return null
  }
  const isURL = typeof spec.img === 'string'
  if (isURL) {
    return (
      <Image 
        src={spec.img as string} 
        alt={`Toggle ${spec.label}`} 
        className={'block mr-1 aspect-square rounded border border-muted-2'}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    )
  }
  const svgStyle: any = { position: 'relative' }
  if (spec.ar && spec.ar < 1) {
    const w = ICON_SIZE * SVG_MULT
    svgStyle.top = (( 1 / spec.ar - 1) * w) / 2
  }
  else if (spec.ar && spec.ar > 1) {
    const h = ICON_SIZE * SVG_MULT
    svgStyle.left = (((1 - spec.ar) * h) / 2)
  }

  return (
    <span 
      className='block overflow-hidden ' 
      style={{
        color: 'inherit',
        width: ICON_SIZE * SVG_MULT, 
        height: ICON_SIZE * SVG_MULT,
      }} 
    >
      {React.cloneElement(spec.img as React.ReactElement<any>, {
        width: (spec.ar ?? 1) * ICON_SIZE * SVG_MULT, 
        height: SVG_MULT * ICON_SIZE,
        style: svgStyle
      })}
    </span>
  )
} 

export default FacetImage

