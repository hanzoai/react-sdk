import type { ImageDef } from '@hanzo/ui/types'

interface Product {
  id: string    // DB index
  sku: string   // human visible on orders etc.
  title: string
  desc?: string
  price: number
    /** empty string means use categories image */
  img?: string | ImageDef
    /** eg, silver, vs individual products */  
}

interface Category {
  id: string
  title: string
  level?: number // for combining cat texts in meaningful ways
  desc?: string
  img?: string | ImageDef
}

interface LineItem {
  product: Product

  /** all observable */
  get quantity(): number
  get canDecrement(): boolean
  get isInCart(): boolean

  increment(): void
  decrement(): void
}

export {
  type Product,
  type Category,
  type LineItem,
}



