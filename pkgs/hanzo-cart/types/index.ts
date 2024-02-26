import type { ReactNode } from 'react'

interface Product {
  id: string    // DB index // not a logical aspect of our domain.  may not be necessary at all
  sku: string   // human visible on orders etc.
  title: string
  categoryId: string  // skuPath, eg LXB-AU-B
  desc?: string
  price: number
  img?: string  // if undefined: (category's img exists) ? (use it) : (use generic placeholder)
}

interface Category {
  id: string      // LXB-AU-B
  title: string   // Lux Gold, Minted Bar
  desc?: string
  img?: string 
  products: Product[] | LineItem[]
}

interface FacetValue {
  token: string             // a token in the sku
  label: string
  specificity: number       // LXB: 0, AU: 1, B: 2
  img : string | ReactNode  // icon is required 
  imgAR? : number           // helps with svgs
}

interface SelectableFacetValue extends FacetValue {
  get selected(): boolean
  setSelected(b: boolean): void
}

  // in the system, client code always 
  // goes through a list item, whether the product
  // is in the cart or not. SOmething is in the cart
  // when its quantity > 0.  That's the only difference
  // The ui, and other Cart code, reacts to 
  // changes in this quantity.
interface LineItem extends Product {

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
  type FacetValue,
  type SelectableFacetValue,
}



