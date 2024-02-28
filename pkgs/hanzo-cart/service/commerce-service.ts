import type {  
  Category, 
  FacetsSelection,
  FacetValue,
  LineItem 
} from '../types'

interface CommerceService {

  get cartItems(): LineItem[]
  get cartTotal(): number
  getCartCategorySubtotal(categoryId: string): number

    /** 
     * Sets the current selected Facets, exclusively.
     * For convenience, returns all the items in 
     *  all categories that are now specified by the 
     *  facet selection state.
     * (and caches them until the next call) 
     * 
     * null resets the selected set to specifying all Category's 
     * and items in the store
     * */ 
  setFacetsSelection(sel: FacetsSelection): Category[]
  get specifiedItems(): LineItem[]
  get specifiedCategories(): Category[] 

  setCurrentItem(sku: string | undefined): void
  get currentItem(): LineItem | undefined
}

export {
  type CommerceService as default
}