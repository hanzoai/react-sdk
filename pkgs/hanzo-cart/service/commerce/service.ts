import type { 
  Product, 
  LineItem, 
  Category 
} from '../../types'

interface CommerceService {

  getQuantity: (productId: string) => number
  incrementQuantity: (productId: string) => void
    /** removes if only one left */
  decrementQuantity: (productId: string) => void 
    /** alpha by SKU */
  get cartContents(): LineItem[]
  get cartTotal(): number
  get itemCount(): number
  getCategorySubtotal: (categoryId: string) => number

    // Specified set
    /** 
     * returns Product's that belong to all categories 
     * (and caches them until the next call) 
     * 
     * null resets the specified set to all products in the store
     * */ 
  setSpecifiedCategories(categoryIds: string[] | null): Product[]
  get specifiedCategories(): Category[] // or empty array


    /** return cached Product (set by above) */
  get specifiedProducts(): Product[]

    /** sorted by level */
  get allCategories(): Category[]
    /** for dev convenience */ 
  get entireStore(): Product[] 
}

export {
  type CommerceService as default
}