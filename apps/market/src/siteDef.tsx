import type { SiteDef } from '@hanzo/ui/types'
import common from '@hanzo/ui/siteDef/main-nav'
import footer from '@hanzo/ui/siteDef/footer'

import type { Facets, Category } from '@hanzo/cart/types'

import facets from '@/store-conf/facets'
import categories from '@/store-conf/data/bullion-products-by-category.json'
 

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
    commerce: {
      facets: facets, 
      categories: categories as Category[]
    }
  }
} satisfies SiteDef
