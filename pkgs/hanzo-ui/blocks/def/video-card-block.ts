import type { Block, CTABlock } from '.'
import type { TShirtDimensions, TShirtSize } from '../../types'

interface VideoCardBlock extends Block {
  blockType: 'video-card'
  video: {
    poster?: string      
    sources?: string[]
    dim: TShirtDimensions 
  }
  size?: TShirtSize
  specifiers?: string
  title?: string
  description?: string
  cta?: CTABlock
}

export {
  type VideoCardBlock as default
}