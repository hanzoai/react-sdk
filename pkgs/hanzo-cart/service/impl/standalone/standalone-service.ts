import type { ReactNode } from 'react'

import { 
  action,
  computed, 
  makeObservable, 
  observable, 
  runInAction, 
} from 'mobx'

import type { 
  Product, 
  Category, 
  SelectableFacetValue, 
  FacetValue,
  LineItem 
} from '../../../types'

import type CommerceService from '../../commerce-service'

class LineItemImpl implements LineItem {

  qu: number = 0

  id: string    
  sku: string   
  title: string
  categoryId: string  
  desc?: string
  price: number
  img?: string  

  constructor(prod: Product) {
    this.id = prod.id
    this.sku = prod.sku
    this.title = prod.title
    this.categoryId = prod.categoryId
    this.desc = prod.desc
    this.price = prod.price
    this.img = prod.img

    makeObservable(this, {
      qu: observable,
      canDecrement: computed,  
      isInCart: computed,
      
      increment: action,
      decrement: action,
    })
  }

  get canDecrement(): boolean { return this.qu > 0 }
  get quantity(): number {return this.qu}
  get isInCart(): boolean {return this.qu > 0}

  increment(): void { this.qu++ }

  decrement(): void {
    if (this.canDecrement) {
      this.qu--
    }
  }

  inCategory(id: string): boolean {
      // TODO: will break for level one (which is ok for lux, but not generally)
    return this.sku.includes(`-${id}-`)
  }

}

class SelectableFacetValueImpl implements SelectableFacetValue {

  private _selected: boolean = true

  readonly token: string
  readonly label: string
  readonly specificity: number  
  readonly img: string | ReactNode

  constructor(c: FacetValue) {
    this.token = c.token
    this.label = c.label
    this.specificity = c.specificity
    this.img = c.img

    makeObservable<SelectableFacetValueImpl, '_selected' >(this, {
      _selected: observable,
    })

    makeObservable(this, {
      selected: computed,
      setSelected: action
    })
  }

  get selected(): boolean {
    return this._selected
  }

  setSelected(b: boolean): void {
    this._selected = b
  }
}

class StandaloneCommerceService 
  implements CommerceService
{
  private _categoryMap = new Map<string, Category>()
  //private _facets
  constructor(
    categories: Category[]
  ) {

    categories.forEach((c) => {
      c.products = c.products.map((p) => (new LineItemImpl(p)))
      this._categoryMap.set(c.id, c)
    })

    makeObservable(this, {
      cartItems: computed,
      cartTotal: computed, 
      specifiedCategories: computed,
      specifiedItems: computed,
      modifySelectedFacetValues: action,
      setSelectedFacetValues: action,
    })

  }

  get cartItems(): LineItem[] {
    let result: LineItem[] = []
    this._categories.forEach((c) => {
      result = [...result, ...(c.products as LineItem[]).filter((item) => (item.isInCart))]
    })
    return result
  }
  
  get cartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => (total + item.price * item.quantity), 
      0
    )
  }

  setSelectedFacetValues(idsToTurnOn: string[] | null): LineItem[] {
    runInAction(() => {
      const allOff = (idsToTurnOn == null || idsToTurnOn.length === 0)
      this._categories.forEach((c) => {
        c.setOn(
          !(allOff || !idsToTurnOn?.includes(c.id))  
        )
      })
    })
    return this.specifiedItems
  }

  modifySelectedFacetValues(states: {[key: string]: boolean}): void {
  runInAction(() => {
    this._categories.forEach((c) => {
      if (c.id in states) {
        c.setOn(states[c.id])
      }
    })
  })
}

  get specifiedCategories(): TogglableCategory[] {
    return this._categories.filter((c) => (c.isOn)).sort( (c1, c2) => (c1.level - c2.level) )  
  }

  get specifiedItems(): LineItem[] {
    const specified = this.specifiedCategories
    const levels: TogglableCategory[][] = []
    const highestLevelPresent = specified.reduce(((result, cat) => ((cat.level! > result) ? cat.level! : result)), 0)
      // TODO level 1 might be active
    for (let i = 2; i <= highestLevelPresent; i++) {
      levels.push(specified.filter((cat) => (cat.level! === i)))
    }

    const result = this._items.filter((item) => (
      levels.every((level) => (level.some((cat) => (item.inCategory(cat.id)))))
    ))

    return result// .sort((a, b) => (a.product.sku.localeCompare(b.product.sku)))
  }

  getCartCategorySubtotal(categoryId: string): number {
    const c = this._categoryMap.get(categoryId)!
    return (c.products as LineItem[]).reduce(
      (total, item) => (total + item.price * item.quantity),
      0
    )
  }
}

export default StandaloneCommerceService
