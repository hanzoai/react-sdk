import type { LineItem, ObsLineItemRef } from './line-item'
import type { CategoryNode, SelectedPaths, CategoryNodeRole } from './category-node'
import type Family from './family'
import type Promo from './promo'


interface CommerceService extends ObsLineItemRef {

    /** Items in cart */
  get cartItems(): LineItem[]
    /** Total of all quantities of all items in cart */
  get cartQuantity(): number
    /** Total of all prices x quantities of items in cart */
  get cartTotal(): number

  get promoAppliedCartTotal(): number

  get cartEmpty(): boolean

  get appliedPromo(): Promo | null
  setAppliedPromo(promo: Promo | null): void
    /** returns the price with promo applied, of undefined if no promo or promo does not apply */
  itemPromoPrice(item: LineItem): number | undefined
   
  getFamilySubtotal(familyId: string): number

  createOrder(email: string, name?: string): Promise<string | undefined>
  updateOrderShippingInfo(orderId: string, shippingInfo: any): Promise<void>
  updateOrderPaymentInfo(orderId: string, paymentInfo: any): Promise<void>

    /** 
     * Sets the tokens at each level supplied.
     * If a level is selected as [], nothing will be selected.
     * If a level is missing (undefined), everything at that level is selected
     * 
     * This selects one or more Family's, and all the LineItem's in them.
     * 
     * An empty value object selects all Family's and all LineItem's,
     * */ 
  selectPaths(value: SelectedPaths): Family[]
  selectPath(skuPath: string): Family[] 

    /** 
     * 'terminal': 
     *    node is node at path,
     *    family is node is node at path (this node), 
     *    families is undefined 
     * 'terminal-w-families': 
     *    node is node at path
     *    family is undefined
     *    families is the subnodes / families of this node
     * 'family-w-siblings': 
     *    node is parent of this family
     *    family is this family
     *    families is this family and siblings
     * 'non-terminal': 
     *    node is node at path
     *    family is undefined
     *    families is undefined
     * 'non-node': all undefined
    */
  peekAtNode(skuPath: string): {
    role: CategoryNodeRole
    family: Family | undefined
    families: Family[] | undefined
    node: CategoryNode | undefined
  } 
    /** @deprecated
     *  Whether this path defines a Family, or if it has further levels 
     * */
  getNodeAtPath(skuPath: string): CategoryNode | undefined 

  get selectedPaths(): SelectedPaths // returns a copy
  
  get selectedItems(): LineItem[]
  get selectedFamilies(): Family[] 
  get hasSelection(): boolean


    /** 
     * Who are the subnodes selected at 'level'? 
     * If more than one value is selected at 'level', 
     * the returned CategoryNode[] may represent multiple sets. 
     * */ 
  getSelectedNodesAtLevel(level: number): CategoryNode[] | undefined 

      /**
     * For convenience, so widgets can share state.
     * "current" is unrelated to what is "selected",
     * ie, facets' values 
     *  */ 
  setCurrentItem(sku: string | undefined): boolean // valid sku and was set.
    /**
     * For convenience, so widgets can share state.
     * "current" is unrelated to what is "selected",
     * ie, facets' values 
     * 
     * note: for ObsLineItemRef, there is also
     *  get item(): LineItem | undefined
     * which simply delegates to this function
     *  */ 
  get currentItem(): LineItem | undefined

  getFamily(id: string): Family | undefined

}


export {
  type CommerceService as default
}