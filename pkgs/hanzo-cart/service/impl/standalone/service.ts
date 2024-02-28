import { 
  computed, 
  makeObservable, 
  observable, 
  runInAction, 
  action,
  toJS
} from 'mobx'

import type { 
  Category, 
  LineItem,
  FacetsSelection, 
  Facets
} from '../../../types'

import type CommerceService from '../../commerce-service'

import ObservableLineItem from './obs-line-item'

export type StandaloneServiceOptions = {
  levelZeroPrefix?: string
}

class StandaloneCommerceService 
  implements CommerceService
{
  private _categoryMap = new Map<string, Category>()
  private _facets: Facets 
  private _selectedFacets: FacetsSelection = {}

  private _options : StandaloneServiceOptions

  private _currentItemSku: string | undefined = undefined

  constructor(
    categories: Category[],
    facets: Facets,
    options: StandaloneServiceOptions={}
  ) {

    this._facets = facets
    this._options = options

    categories.forEach((c) => {
      c.products = c.products.map((p) => (new ObservableLineItem(p)))
      this._categoryMap.set(c.id, c)
    })

    makeObservable<
      StandaloneCommerceService, 
        '_selectedFacets' | 
        '_currentItemSku' 
    >(this, {
      _selectedFacets :  observable.deep,
      _currentItemSku: observable,
    })

    makeObservable(this, {
      cartItems: computed,
      cartTotal: computed, 
      specifiedItems: computed,
      setCurrentItem: action,
      currentItem: computed,
      specifiedCategories: computed 
      /* NOT setFacetsSelection. It implements it's action mechanism */
    })

  }

  get cartItems(): LineItem[] {
    let result: LineItem[] = []
    this._categoryMap.forEach((cat) => {
      result = [...result, ...(cat.products as LineItem[]).filter((item) => (item.isInCart))]
    })
    return result
  }
  
  get cartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => (total + item.price * item.quantity), 
      0
    )
  }

  setCurrentItem(sku: string | undefined): void {
    this._currentItemSku = sku
  }

  get currentItem(): LineItem | undefined {
    if (!this._currentItemSku) return undefined

    let foundItem: LineItem | undefined = undefined
    const catIdsTried: string[] = []
    if (this.specifiedCategories && this.specifiedCategories.length > 0) {
      const specCatsIter = this.specifiedCategories.entries()
      let catNode
      do {
        catNode = specCatsIter.next()
        const [ , cat] = catNode.value
        catIdsTried.push(cat.id)
        foundItem = 
          (cat.products as LineItem[]).find((item) => (item.sku === this._currentItemSku))
      }  while (!foundItem && !catNode.done)
    }
    if (foundItem) return foundItem

    const allCatsIter = this._categoryMap.entries()
    let catNode
    do {
      catNode = allCatsIter.next()
      const [ , cat] = catNode.value
      if (catIdsTried.includes(cat.id)) continue
      foundItem = (cat.products as LineItem[])
        .find((item) => (item.sku === this._currentItemSku))
    }  while (!foundItem && !catNode.done)
    return foundItem
  }

  setFacetsSelection(sel: FacetsSelection): Category[] {
    runInAction (() => {
      const res = this._processAndValidate(sel) 
      if (res) {
        this._selectedFacets = res
      }
    })
    return this.specifiedCategories
  }

  get specifiedCategories(): Category[] {
    if (Object.keys(toJS(this._selectedFacets)).length === 0) {
      // Facets have never been set or unset, so cannot evaluate them
      return []
    }
    const keysStr = Object.keys(this._facets)
      // 1-base, visiting two per iteration
    let current: string[] = this._selectedFacets[1] 
    for (let i = 2; i <= keysStr.length; i++) {
      current = StandaloneCommerceService._visit(current, this._selectedFacets[i])
    }
    const prefix = this._options.levelZeroPrefix ?? ''
    return current.map((almostTheCatId) => (this._categoryMap.get(prefix + almostTheCatId)!))
  }

  private static _visit(current: string[], next: string[]): string[] {
    const result: string[] = []
    current.forEach((c) => {
      next.forEach((n) => {
        result.push(`${c}-${n}`)
      })
    })
    return result
  }

  private _processAndValidate(partial: FacetsSelection): FacetsSelection | undefined {
    const result: FacetsSelection = {}
    const keysStr = Object.keys(this._facets)
    const keysNum = keysStr.map((key) => (parseInt(key)))
    keysNum.forEach((key) => {
        // if not present, assume the facet is "off" and allow all (include all in the set).
      if (!partial[key]) {
        result[key] = this._facets[key].map((fv) => (fv.token))
      }
        // If present, filter out the bad values if any
      const filtered = partial[key].filter((fv) => this._facets[key].find((fvDesc) => (fvDesc.token === fv)))
      result[key] = filtered
    })
    return result
  }

  get specifiedItems(): LineItem[] {
    if (Object.keys(toJS(this._selectedFacets)).length === 0) {
      // Facets have never been set or unset, so cannot evaluate them
      return []
    }

    return this.specifiedCategories.reduce(
      (allProducts, cat) => ([...allProducts, ...(cat.products as LineItem[])]), [] as LineItem[])
  }

  getCartCategorySubtotal(categoryId: string): number {
    const c = this._categoryMap.get(categoryId)!
    return (c.products as LineItem[]).reduce(
        // avoid floating point bs around zero
      (total, item) => (item.quantity > 0 ? total + item.price * item.quantity : total),
      0
    )
  }
}

export default StandaloneCommerceService
