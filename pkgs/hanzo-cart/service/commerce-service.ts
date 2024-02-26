import type { LineItem, Category, FacetValue } from '../types'

interface CommerceService {

    /** alpha by SKU */
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
  setSelectedFacetValues(tokens: string[] | null): Category[]

    /** 
     * non-exclusively sets the supplied Facets to the supplied states.
     * Caches and returns the resultant item set as above. 
     * */ 
  modifySelectedFacetValues(states: {[key: string]: boolean}): LineItem[]
  get selectedFacetValues(): FacetValue[]         // or empty array

    // TODO: NEEDED?
  getFacets(ids: string[]): FacetValue[] //"facets from id's"

  get specifiedCategories(): Category[] // or empty array
  get specifiedItems(): LineItem[]

}

export {
  type CommerceService as default
}