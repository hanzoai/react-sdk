
import type CTABlock from './cta-block'
import type Block from './block'
import type ImageBlock from './image-block'
import type VideoBlock from './video-block'
import type ElementBlock from './element-block'
import type EnhHeadingBlock from './enh-heading-block'

interface CartBlancheBlock extends Block {
  blockType: 'cart-blanche'
  specifiers?: string // 'media-left' or 'appear-disabled' or 'no-borders', etc... can be combined
  heading?: EnhHeadingBlock
  body?: string | ElementBlock 
  media?: ImageBlock | VideoBlock
  cta?: CTABlock
}

export {
  type CartBlancheBlock as default
}
