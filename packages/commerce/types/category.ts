import type { ImageDef } from '@hanzo/ui/types'
import type Product from './product'

interface Category {
  id: string          // LXB-AU-B
  title: string       // Minted Bar
  parentTitle?: string // Lux Gold
  desc?: string
  img?: ImageDef, 
    // inbound they're Products and then interally they become LineItems
  products: Product[] 
}

export {
  type Category as default
}