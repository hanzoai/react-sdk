import type { Product, LineItem, Category } from '../../types'

interface CommerceService {

  addToCart: (p: Product) => void

  incrementQuantity: (productId: string) => void
    /** removes if only one left */
  decrementQuantity: (productId: string) => void 

  getCategorySubtotal:  (categoryId: string) => number

    /** default is alpha by SKU */
  getCategoryLineItems: (categoryId: string) => LineItem[]

    /** alpha by SKU */
  get lineItems(): LineItem[]
  
  get total(): number
  get itemCount(): number

    /** alpha by id */
  get categories(): Category[]
    /** for dev convenience */ 
  get entireStore(): Product[] 
}

export {
  type CommerceService as default
}