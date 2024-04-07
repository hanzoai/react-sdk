'use client'
import React from 'react'

import Spline from '@splinetool/react-spline'

import { cn } from '../util'
import { type Block, type VideoBlock, VideoBlockComponent } from '../blocks'
import type { MediaStackDef, Dimensions } from '../types'

import Image from './image'

const MediaStack: React.FC<{
  media: MediaStackDef,
  constrainTo?: Dimensions
  clx?: string
}> = ({
  media: {img, video, animation},
  constrainTo: cnst = {w: 250, h: 250},
  clx=''
}) => {

    // Order of precedence: 3D > MP4 > Image
  return animation ? ( 
    <Spline
      scene={animation}
      className={cn(clx, 'pointer-events-none')} 
      style={{
          // // !aspect-[12/10] 
        width: (6/5 * (typeof cnst.h === 'number' ? cnst.h as number : parseInt(cnst.h as string)) ),
        height: cnst.h
      }}
    />
  ) : video ? (
    <VideoBlockComponent
      constrainTo={cnst}
      block={{blockType: 'video', ...video} satisfies VideoBlock as Block}
      className={clx}
    />
  ) : (img && 
    <Image
      def={img}
      constrainTo={cnst} 
      className={cn('m-auto', clx)}
    />
  ) // TODO: return placeholder
}

export default MediaStack
