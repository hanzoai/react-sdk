import type { SiteDef } from '@hanzo/ui/types'
import common from '@hanzo/ui/siteDef/main-nav'
import footer from '@hanzo/ui/siteDef/footer'

export default {
  currentAs: 'https://lux.market',
  nav: {
    common,
    featured: [{
      title: "Login",
      href: "/login",
      newTab: false,
      external: false,
      variant: 'primary',
    }],
  },
  footer
} satisfies SiteDef
