import type { CTABlock } from '@hanzo/ui/blocks/def'
import video from './video'
import AddToCartForm from '@hanzo/cart/components/add-to-cart-form'

export default {
  blockType: 'banner',
  title: 'LUX SILVER',
  byline: 'The Silver Rush is Here.',
  video: {...video, sizing: { vh: 50}},
  contentAfter: <AddToCartForm product={{
    id: 'silver',
    title: 'Silver',
    price: 12.45,
    description: 'The Silver Rush is Here.',
    image: '/assets/video/luxsilver-poster.jpg'
  }}/>,
  cta: {
    blockType: 'cta',
    elements: [
      {
        title: "Learn More",
        href: "/silver",
        variant: 'outline'
      },
      {
        title: "Buy Now",
        href: "https://lux.town",
        external: true,
        newTab: false,
        variant: 'primary'
      },
    ]
  } as CTABlock
}
