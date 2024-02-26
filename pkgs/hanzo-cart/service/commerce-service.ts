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

    /** 
     * Apply the specified mods to the FacetsSelection.
     * Caches and returns the resultant items set. 
     * */ 
  //modifyFacetsSelection(mods: Record<number, {token: string, selected: boolean}[]>): LineItem[]
  //get facetsSelection(): FacetsSelection       

    // TODO: NEEDED?
  //getFacets(ids: string[]): FacetValue[] //"facets from id's"

  //get specifiedCategories(): Category[] // or empty array
  get specifiedItems(): LineItem[]

}

export {
  type CommerceService as default
}