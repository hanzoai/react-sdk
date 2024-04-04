'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { cn } from '@hanzo/ui/util'

import {
  ApplyTypography,
  MediaStack
} from '@hanzo/ui/primitives'
import type { Family } from '../../../types'

const FamilySlide: React.FC<{
  family: Family
  clx?: string
  mediaConstraint?: {w: number, h: number}
  getBylineText?: (c: Family) => string
  variantOrientation?: 'vert' | 'horiz' 
  showVariantImage?: boolean
  showVariantPrice?: boolean
}> = ({
  family,
  clx='',
  mediaConstraint,
  getBylineText,
  variantOrientation,
  showVariantImage,
  showVariantPrice
}) => {


  return <></>
}

export default FamilySlide
