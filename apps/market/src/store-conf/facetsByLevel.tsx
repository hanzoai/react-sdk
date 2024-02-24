import type { CategoryFacetSpec } from '@hanzo/cart/types'

import SVG_Bar from './bar.svg'
import SVG_Coin from './coin.svg'
import SVG_Multibar from './multibar.svg'
import SVG_GD from './good-delivery.svg'

const ICON_SIZE = 16

const TYPE = [
  {
    id: 'AG',
    label: 'Silver',
    img: '/assets/img/cart/ui/facets/silver-swatch-200x200.png'
  },
  {
    id: 'AU',
    label: 'Gold',
    img: '/assets/img/cart/ui/facets/gold-swatch-150x150.png'
  },
]


const FORM = [
  {
    id: 'B',
    label: 'Minted Bar',
    img: <SVG_Bar />,
    ar: 1
  },
  {
    id: 'C',
    label: 'Coin',
    img: <SVG_Coin />,
    ar: 64/80
  },
  {
    id: 'MB',
    label: 'Multibar',
    img: <SVG_Multibar />,
    ar: 128/160
  },
  {
    id: 'GD',
    label: 'Good Del.',
    img: <SVG_GD />,
    ar: 24/30
  },
]

export default [
  TYPE, 
  FORM
] satisfies CategoryFacetSpec[][]