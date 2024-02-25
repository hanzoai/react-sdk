import type { LineItem, Category, Facet } from '../types'

interface CommerceService {

    /** alpha by SKU */
  get cartItems(): LineItem[]
  get cartTotalValue(): number
  get cartItemCount(): number
  
  getCategorySubtotal: (categoryId: string) => number

    /** 
     * Exclusively sets the current selected Facets.
     * For convenience, returns all the items in 
     *  all categories that are now specified by the 
     *  facet selection state.
     * (and caches them until the next call) 
     * 
     * null resets the selected set to specifying all Category's 
     * and Products in the store
     * */ 
  setSelectedFacets(tokens: string[] | null): LineItem[]

    /** 
     * non-exclusively sets the supplied Facets to the supplied states.
     * Caches and returns the resultant Product set as above. 
     * */ 
  modifySelectedFacets(states: {[key: string]: boolean}): LineItem[]
  get selectedFacets(): Facet[]         // or empty array

  getFacets(ids: string[]): Facet[]

  get specifiedCategories(): Category[] // or empty array
  get specifiedItems(): LineItem[]

    /** for dev convenience */ 
  get allItems(): LineItem[] 
}

export {
  type CommerceService as default
}