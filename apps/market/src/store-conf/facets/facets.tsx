import type { FacetValue } from '@hanzo/cart/types'

import SVG_Bar from './bar.svg'
import SVG_Coin from './coin.svg'
import SVG_Multibar from './multibar.svg'
import SVG_GD from './good-delivery.svg'

const TYPE = [
  {
    token: 'AG',
    level: 1,
    label: 'Silver',
    img: '/assets/img/cart/ui/facets/silver-swatch-200x200.png'
  },
  {
    token: 'AU',
    level: 1,
    label: 'Gold',
    img: '/assets/img/cart/ui/facets/gold-swatch-150x150.png'
  },
] satisfies FacetValue[]

const FORM = [
  {
    token: 'B',
    label: 'Minted Bar',
    level: 2,
    img: <SVG_Bar />,
    imgAR: 1
  },
  {
    token: 'C',
    label: 'Minted Coin',
    level: 2,
    img: <SVG_Coin />,
    imgAR: 64/80
  },
  {
    token: 'MB',
    label: 'Multibar',
    level: 2,
    img: <SVG_Multibar />,
    imgAR: 128/160
  },
  {
    token: 'GD',
    label: 'Good Delivery',
    level: 2,
    img: <SVG_GD />,
    imgAR: 24/30
  },
] satisfies FacetValue[]

export default [
  TYPE, 
  FORM
] satisfies FacetValue[][]