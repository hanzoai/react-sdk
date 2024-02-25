import type { ReactNode } from 'react'

import type { ImageDef } from '@hanzo/ui/types'

interface Product {
  id: string    // DB index
  sku: string   // human visible on orders etc.
  title: string
  desc?: string
  price: number
    /** empty string means use categories image */
  img?: string 
    /** eg, silver, vs individual products */  
}

interface Category {
  skuPath: string   // LXB-AU-B
  title: string     // Lux Gold, Minted Bar
  desc?: string
  img?: string 
}

interface Facet {
  token: string
  label: string
  level: number
  img : string | ReactNode // must have a icon string
  imgAR? : number // for easier svgs
}

interface SelectableFacet extends Facet {
  get selected(): boolean
  setSelected(b: boolean): void
}

  // in the system, client code always 
  // goes through a list item, whether the product
  // is in the cart or not. SOmething is in the cart
  // when its quantity > 0.  That's the only difference
  // The ui, and other Cart code, reacts to 
  // changes in this quantity.
interface LineItem {
  product: Product

  /** all observable */
  get quantity(): number
  get canDecrement(): boolean
  get isInCart(): boolean

  increment(): void
  decrement(): void

  inCategory(id: string): boolean
}

export {
  type Product,
  type Category,
  type LineItem,
  type Facet,
  type SelectableFacet,
}



