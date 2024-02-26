import type { SiteDef } from '@hanzo/ui/types'
import common from '@hanzo/ui/siteDef/main-nav'
import footer from '@hanzo/ui/siteDef/footer'

import type { FacetValue, Category } from '@hanzo/cart/types'

import facets from '@/store-conf/facets/facets'
import categoriesObj from '@/store-conf/data/bullion-categories.json'
 

export default {
  currentAs: 'https://lux.market',
  nav: {
    common,
    featured: [{
      title: "Enter App",
      href: "https://app.lux.market",
      newTab: false,
      external: true,
      variant: 'primary',
    }],
  },
  footer, 
  ext: {
    store: {
      facets: facets satisfies FacetValue[][],
      categories: Object.values(categoriesObj) as Category[]
    }
  }
} satisfies SiteDef
