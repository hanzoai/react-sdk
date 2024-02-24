import type { CategoryFacetSpec } from '@hanzo/cart/types'

const TYPE = [
  {
    id: 'AG',
    label: 'Silver',
    img: '/assets/img/cart/ui/silver-swatch-200x200.png'
  },
  {
    id: 'AU',
    label: 'Gold',
    img: '/assets/img/cart/ui/gold-swatch-150x150.png'
  },
]


const FORM = [
  {
    id: 'B',
    label: 'Minted Bar',
  },
  {
    id: 'C',
    label: 'Coin',
  },
  {
    id: 'MB',
    label: 'Multibar',
  },
  {
    id: 'GD',
    label: '"Good Delivery" Bar',
  },
]

export default [
  TYPE, 
  FORM
] satisfies CategoryFacetSpec[][]