import type { SiteDef } from '@hanzo/ui/types'
import common from '@hanzo/ui/siteDef/main-nav'
import footer from '@hanzo/ui/siteDef/footer'

export default {
  currentAs: 'https://lux.market',
  nav: {
    common,
    auth: true,
  },
  footer,
} satisfies SiteDef
