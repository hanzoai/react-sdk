import type { SiteDef } from '@hanzo/ui/types'
import common from '@hanzo/ui/siteDef/main-nav'
import footer from '@hanzo/ui/siteDef/footer'

import type { CategoryFacetSpec } from '@hanzo/cart/types'
import facets from '@/store-conf/facetsByLevel'

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
      facets: facets satisfies CategoryFacetSpec[][]
    }
  }
} satisfies SiteDef
