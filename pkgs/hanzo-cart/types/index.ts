import type { ImageDef } from '@hanzo/ui/types'

interface Product {
  id: string    // DB index
  sku: string   // human visible on orders etc.
  title: string
  desc: string
  price: number
    /** empty string means use categories image */
  image?: string | ImageDef
    /** eg, silver, vs individual products */  
}

interface Category {
  id: string
  title: string
  desc: string
  image?: string | ImageDef
  in: (sku: string) => boolean
}

interface LineItem extends Product {
  quantity: number
}

export {
  type Product,
  type Category,
  type LineItem
}



