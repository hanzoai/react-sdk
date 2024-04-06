import { 
  computed, 
  makeObservable, 
  observable, 
  runInAction, 
  action,
  toJS
} from 'mobx'

import { computedFn } from 'mobx-utils'

import type {
  CommerceService, 
  Family, 
  LineItem,
  SelectedPaths, 
  CategoryNode,
  CategoryNodeRole,
  Promo
} from '../../../types'

import {
  createOrder as createOrderHelper,
  updateOrderShippingInfo as updateOrderShippingInfoHelper,
  updateOrderPaymentInfo as updateOrderPaymentInfoHelper
} from './orders'

import ActualLineItem, { type ActualLineItemSnapshot } from './actual-line-item'
import { getParentPath } from '../../../service/path-utils'
import sep from '../../sep'

type StandaloneServiceOptions = {
  dbName: string
  ordersTable: string
}

interface StandaloneServiceSnapshot {
  items: ActualLineItemSnapshot[]  
}


class StandaloneService 
  implements CommerceService
{
  private _familyMap = new Map<string, Family>()
  private _rootNode: CategoryNode 
  private _selectedPaths: SelectedPaths = {}
  private _promo: Promo | null = null

  private _options : StandaloneServiceOptions
  private _currentItem: ActualLineItem | undefined = undefined

  constructor(
    families: Family[],
    rootNode: CategoryNode,
    options: StandaloneServiceOptions,
    serviceSnapshot?: StandaloneServiceSnapshot,
  ) {

    this._rootNode = rootNode
    this._options = options

    families.forEach((fam) => {
      fam.products = fam.products.map((p) => { 
        if (serviceSnapshot) {
          const itemSnapshot = serviceSnapshot.items.find((is) => (is.sku === p.sku))
          if (itemSnapshot) {
            return new ActualLineItem(p, itemSnapshot)
          }
        }
        return new ActualLineItem(p)
      })
      this._familyMap.set(fam.id, fam)
    })

    makeObservable<
      StandaloneService, 
        '_selectedPaths' | 
        '_currentItem' |
        '_promo'
    >(this, {
      _selectedPaths : observable.deep,
      _currentItem: observable.shallow,
      _promo: observable,
    })

    makeObservable(this, {
      cartItems: computed,
      cartQuantity: computed,
      cartTotal: computed,
      promoAppliedCartTotal: computed,
      cartEmpty: computed,
      selectedItems: computed,
      selectedFamilies: computed, 
      hasSelection: computed, 
      setCurrentItem: action,
      currentItem: computed,
      item: computed,
      selectedPaths: computed,
      appliedPromo: computed,
      setAppliedPromo: action,
      /* NOT selectPaths. It implements it's action mechanism */
    })
  }

  getFamily(id: string): Family | undefined {
    return this._familyMap.get(id)
  }

  getNodeAtPath(skuPath: string): CategoryNode | undefined {
    const toks = skuPath.split(sep.tok)
    let level = 1
    let node: CategoryNode | undefined = this._rootNode
    do {
      node = node!.subNodes?.find((sn) => (sn.skuToken === toks[level])) 
      level++
    }
    while (node && (level < toks.length))
    return level === toks.length ? node : undefined 
  } 

  peekAtNode(skuPath: string): {
    role: CategoryNodeRole
    family: Family | undefined
    families: Family[] | undefined
    node: CategoryNode | undefined
  } {
    const toks = skuPath.split(sep.tok)
    let level: number
    let node: CategoryNode | undefined = this._rootNode
    let parent: CategoryNode | undefined = undefined
    for (level = 1; level < toks.length && node && node.subNodes; level++) {
      parent = node
      node = node!.subNodes.find((sn) => (sn.skuToken === toks[level])) 
      if (!node) {
        throw new Error(`service.peekAtNode: traversing '${skuPath}'... no CategoryNode at '${toks[level]}'!`)
      }
    }
    const atEnd = level === toks.length

    let role: CategoryNodeRole = 'non-node' 
    let families: Family[] | undefined = undefined
    let family: Family | undefined = undefined
    if (atEnd && node) {
      if (!node.subNodes) {
        if (parent?.terminal) {
          role = 'family-w-siblings'  
          const fam = this._familyMap.get(skuPath)
          if (!fam) {
            throw new Error(`service.peekAtNode: '${skuPath}' graphs as a Family w siblings, but no corresponding family exists!`)
          }
          family = fam
          const parentPath = getParentPath(skuPath)
            // get all siblings (subnodes of parent)
          families = parent.subNodes!.map((sub) => {
            const familyId = parentPath + sep.tok + sub.skuToken
            const fam = this._familyMap.get(familyId)
            if (!fam) {
              throw new Error(`service.peekAtNode: No sibling Family for '${skuPath}' with id '${familyId}'!`)
            }
            return fam
          })
          node = parent
        }
        else {
          role = 'terminal'  
          const fam = this._familyMap.get(skuPath)
          if (!fam) {
            throw new Error(`service.peekAtNode: '${skuPath}' graphs as terminal CategoryNode and Family, but no corresponding family exists!`)
          }
          family = fam
        }
      }
      else {
        if (node.terminal) {
          role = 'terminal-w-families'
          families = node.subNodes.map((sub) => {
            const familyId = skuPath + sep.tok + sub.skuToken
            const fam = this._familyMap.get(familyId)
            if (!fam) {
              throw new Error(`service.peekAtNode: No sub Family for CategoryNode '${skuPath}' with id ${familyId}!`)
            }
            return fam
          })
        }
        else {
          role = 'non-terminal'
        }
      }
    }
    return {
      role,
      family,
      families,
      node
    }
  } 

  getSelectedNodesAtLevel = computedFn((level: number): CategoryNode[] | undefined => {

    let lvl = 1
    let nodesAtLevel: CategoryNode[] | undefined  = this._rootNode.subNodes

    do {
      let selectedAtLevel: CategoryNode[] | undefined = undefined
        // If not specified, assume all
      if (lvl in this._selectedPaths) {
        selectedAtLevel = nodesAtLevel!.filter((n) => (this._selectedPaths[lvl].includes(n.skuToken))) 
      }
      else {
        selectedAtLevel = nodesAtLevel 
      }
      let allSubsOfSelected: CategoryNode[] = []
      selectedAtLevel?.forEach((n: CategoryNode) => {
        if (n.subNodes) {
          allSubsOfSelected = [...allSubsOfSelected, ...n.subNodes] 
        }  
      })

      nodesAtLevel = allSubsOfSelected
      lvl++
    } while (nodesAtLevel.length > 0 && lvl <= level)

    return (nodesAtLevel.length > 0 && ((lvl - 1) === level)) ? nodesAtLevel : undefined
  })


  //async createOrder(email: string, paymentMethod: string): Promise<string | undefined> {
  async createOrder(email: string, name?: string): Promise<string | undefined> {
    const snapshot = this.takeSnapshot()
    const order = await createOrderHelper(email, snapshot.items, this._options, name) // didn't want to have two levels of 'items'
    return order.id
  }

  // TODO: add shippingInfo type
  async updateOrderShippingInfo(orderId: string, shippingInfo: any): Promise<void> {
    updateOrderShippingInfoHelper(orderId, shippingInfo, this._options)
  }

  // TODO: add paymentInfo type
  async updateOrderPaymentInfo(orderId: string, paymentInfo: any): Promise<void> {
    updateOrderPaymentInfoHelper(orderId, paymentInfo, this._options)
  }

  takeSnapshot = (): StandaloneServiceSnapshot => ({
    items : (this.cartItems as ActualLineItem[]).map((it) => (it.takeSnapshot(this)))
  })

  get cartItems(): LineItem[] {
    let result: LineItem[] = []
    this._familyMap.forEach((fam) => {
      result = [...result, ...(fam.products as LineItem[]).filter((item) => (item.isInCart))]
    })
    return result.sort((it1, it2) => ((it1 as ActualLineItem).timeAdded - (it2 as ActualLineItem).timeAdded))
  }
  
  get cartEmpty(): boolean {
    return this.cartItems.length === 0    
  }

  get cartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => (total + item.price * item.quantity), 
      0
    )
  }

  _promoValue_unsafe(value: number): number {
    if (this._promo!.type === 'percent') {
      return value * (1 - this._promo!.value / 100)
    }
    return value - this._promo!.value
  }

  get promoAppliedCartTotal(): number {   
    if (!this._promo) {
      return this.cartTotal
    }
    if (!this._promo.skus) {
      return this._promoValue_unsafe(this.cartTotal)
    }
    let total = this.cartItems.reduce(
      (total, item) => {
        const itemPrice = this._promo!.skus!.includes(item.sku) ? 
          this._promoValue_unsafe(item.price)
          :
          item.price
        return total + itemPrice * item.quantity
      }, 
      0
    )
    return total
  }

  itemPromoPrice(item: LineItem): number | undefined {
    if (this._promo && (!this._promo.skus || this._promo.skus.includes(item.sku) )) {
      return this._promoValue_unsafe(item.price)
    }
    return undefined 
  }

  get cartQuantity(): number {
    return this.cartItems.reduce(
      (total, item) => (total + item.quantity), 
      0
    )
  }

  get appliedPromo(): Promo | null {
    return this._promo
  }

  setAppliedPromo(promo: Promo | null): void {
    this._promo = promo
  }

  setCurrentItem(skuToFind: string | undefined): boolean {

    if (skuToFind === undefined || skuToFind.length === 0) {
      this._currentItem = undefined
      return true
    }
      // self calling function
    this._currentItem = ((): ActualLineItem | undefined  => {

      const familiesTried: string[] = []
      if (this.selectedFamilies && this.selectedFamilies.length > 0) {
          for (let family of this.selectedFamilies) {
          familiesTried.push(family.id)
          const foundItem = family.products.find((p) => (p.sku === skuToFind))
          if (foundItem) {
            return foundItem as ActualLineItem
          }
        }
      }
      for( const [familyId, family] of this._familyMap.entries()) {
        if (familiesTried.includes(familyId)) continue
        const foundItem = family.products.find((p) => (p.sku === skuToFind)) as ActualLineItem | undefined
        if (foundItem) {
          return foundItem as ActualLineItem
        }
      }
      return undefined
    })();

    return !!this._currentItem
  }

  /* ObsLineItemRef */
  get item(): LineItem | undefined {
    return this._currentItem
  }

  get currentItem(): LineItem | undefined {
    return this._currentItem
  }

  selectPaths(sel: SelectedPaths): Family[] {
    runInAction (() => {
      this._selectedPaths = this._processAndValidate(sel) 
    })
    return this.selectedFamilies
  }

  selectPath(skuPath: string): Family[] {
    const toks = skuPath.split(sep.tok)
    const highestLevel = toks.length - 1
    const fsv: SelectedPaths = {}
    for (let level = 1; level <= highestLevel; level++ ) {
      fsv[level] = [toks[level]]   
    } 
    return this.selectPaths(fsv)
  }

  get selectedPaths(): SelectedPaths {
    const result: SelectedPaths = {}
    for( let level in this._selectedPaths ) {
      result[level] = [...this._selectedPaths[level]]
    }
    return result
  }

  get selectedFamilies(): Family[] {
    if (Object.keys(toJS(this._selectedPaths)).length === 0) {
      // FacetsDesc have never been set or unset, so cannot evaluate them
      return []
    }

    return this._rootNode.subNodes!.reduce(
      (acc: Family[], subFacet: CategoryNode) => (
          // Pass the root token as a one member array
        this._reduceNode([this._rootNode.skuToken], acc, subFacet)   
      ), 
      []
    )
  }

  private _reduceNode(parentPath: string[], acc: Family[], node: CategoryNode): Family[] {
    const path = [...parentPath, node.skuToken] // Don't mutate original please :) 
    const level = path.length - 1
      // If there is no token array supplied for this level,
      // assume all are specified.  Otherwise, see if the 
      // current node is in the array
    const specified = (
      !this._selectedPaths[level] 
      || 
      this._selectedPaths[level].includes(node.skuToken)
    ) 
    if (specified) {
        // Process subnodes
      if (node.subNodes && node.subNodes.length > 0) {
        return node.subNodes.reduce((acc, n) => (
          this._reduceNode(path, acc, n)
        ) 
        , acc)
      }
        // Process leaf
      const fam = this._familyMap.get(path.join(sep.tok))
      if (!fam) {
        throw new Error("selectedFamilies WTF?!" + path.join(sep.tok))
      }
      acc.push(fam)    
    }
    return acc
  }

  private _processAndValidate(partial: SelectedPaths): SelectedPaths  {

    const result: SelectedPaths = {}

    let level = 1
    let currentSet = this._rootNode.subNodes!
    
    while (true) {
      let possibleCurrent = currentSet.map((el) => (el.skuToken))
      const validTokens = !partial[level] ? undefined : partial[level].filter((tok) => possibleCurrent.includes(tok))
      if (!validTokens) {
        break
      }
      result[level] = validTokens
      currentSet = validTokens.map((tok) => {
        const fd = currentSet.find((node) => ( node.skuToken === tok ))
        return (fd && fd.subNodes && fd.subNodes.length > 0) ? fd.subNodes : []
      }).flat()
      level++
    }
    
    return result
  }

  get selectedItems(): LineItem[] {
    if (Object.keys(toJS(this._selectedPaths)).length === 0) {
      // FacetsDesc have never been set or unset, so cannot evaluate them
      return []
    }

    return this.selectedFamilies.reduce(
      (allProducts, fam) => ([...allProducts, ...(fam.products as LineItem[])]), [] as LineItem[])
  }

  get hasSelection(): boolean {
    return this.selectedFamilies.length > 0
  }

  getFamilySubtotal(familyId: string): number {
    const c = this._familyMap.get(familyId)!
    return (c.products as LineItem[]).reduce(
        // avoid floating point bs around zero
      (total, item) => (item.quantity > 0 ? total + item.price * item.quantity : total),
      0
    )
  }

}

export {
  type StandaloneServiceOptions, 
  type StandaloneServiceSnapshot,
  StandaloneService as default
} 
