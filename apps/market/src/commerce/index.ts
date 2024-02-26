import type { Category } from '@hanzo/cart/types'

import facets from './facets'
import categories from './data/bullion-products-by-category.json'
import conf from './conf'

export default {
  facets, 
  categories: categories as Category[],
  conf
}