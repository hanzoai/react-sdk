import type { Facets, FacetValue } from '@hanzo/cart/types'

import SVG_Bar from './img/bar.svg'
import SVG_Coin from './img/coin.svg'
import SVG_Multibar from './img/multibar.svg'
import SVG_GD from './img/good-delivery.svg'

const TYPE = [
  {
    token: 'AG',
    label: 'Silver',
    img: '/assets/img/cart/ui/facets/silver-swatch-200x200.png'
  },
  {
    token: 'AU',
    label: 'Gold',
    img: '/assets/img/cart/ui/facets/gold-swatch-150x150.png'
  },
] satisfies FacetValue[]

const FORM = [
  {
    token: 'B',
    label: 'Minted Bar',
    img: <SVG_Bar />,
    imgAR: 1
  },
  {
    token: 'C',
    label: 'Minted Coin',
    img: <SVG_Coin />,
    imgAR: 64/80
  },
  {
    token: 'MB',
    label: 'Multibar',
    img: <SVG_Multibar />,
    imgAR: 128/160
  },
  {
    token: 'GD',
    label: 'Good Delivery',
    img: <SVG_GD />,
    imgAR: 24/30
  },
] satisfies FacetValue[]

export default {
  1: TYPE,
  2: FORM
} satisfies Facets as Facets




