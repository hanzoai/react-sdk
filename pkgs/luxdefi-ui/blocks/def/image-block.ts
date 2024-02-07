import type { Dimensions } from '../../types'
import type Block from './block'

// https://nextjs.org/docs/app/api-reference/components/image
interface ImageBlock extends Block {
  blockType: 'image'
  src: string      
  alt: string
  dim?:  Dimensions 
  fullWidthOnMobile?: boolean
  // cf: next/Image documentation, and type, as well as React.ImgHTMLAttributes
  props?: {
    sizes?: string
    fill?: boolean 
    style?: {
      objectFit?: string
      objectPosition?: string
      width?: number | string
      height?: number | string
    }
  }
}

export {
  type ImageBlock as default,
}