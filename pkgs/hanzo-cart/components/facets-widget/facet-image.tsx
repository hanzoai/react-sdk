import React from 'react'
import Image from 'next/image'

import type { FacetValue } from '../../types'

const ICON_SIZE = 16
const SVG_MULT = 1.5

const FacetImage: React.FC<{
  facetValue: FacetValue
}> = ({
  facetValue
}) => {
  if (!facetValue.img) {
    return null
  }
  const isURL = typeof facetValue.img === 'string'
  if (isURL) {
    return (
      <Image 
        src={facetValue.img as string} 
        alt={`Toggle ${facetValue.label}`} 
        className={'block mr-1 aspect-square rounded border border-muted-2'}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    )
  }
  const svgStyle: any = { position: 'relative' }
  if (facetValue.imgAR && facetValue.imgAR < 1) {
    const w = ICON_SIZE * SVG_MULT
    svgStyle.top = (( 1 / facetValue.imgAR - 1) * w) / 2
  }
  else if (facetValue.imgAR && facetValue.imgAR > 1) {
    const h = ICON_SIZE * SVG_MULT
    svgStyle.left = (((1 - facetValue.imgAR) * h) / 2)
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
      {React.cloneElement(facetValue.img as React.ReactElement<any>, {
        width: (facetValue.imgAR ?? 1) * ICON_SIZE * SVG_MULT, 
        height: SVG_MULT * ICON_SIZE,
        style: svgStyle
      })}
    </span>
  )
} 

export default FacetImage

