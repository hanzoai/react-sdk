
import type Block from './block'
import type CTABlock from './cta-block'
import type ImageBlock from './image-block'
import type EnhHeadingBlock from './enh-heading-block'
import type VideoBlock from './video-block'

interface CartBlancheBlock extends Block {
  blockType: 'cart-blanche'
  specifiers?: string 
  heading?: EnhHeadingBlock
  content?: Block[] 
  media?: ImageBlock | VideoBlock
  cta?: CTABlock
}

export {
  type CartBlancheBlock as default
}
