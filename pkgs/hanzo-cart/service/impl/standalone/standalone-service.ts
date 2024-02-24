import { 
  action,
  computed, 
  makeAutoObservable,
  makeObservable, 
  observable, 
  runInAction, 
} from 'mobx'

import type { ImageDef } from '@hanzo/ui/types'

import type { 
  Product, 
  Category, 
  TogglableCategory, 
  LineItem 
} from '../../../types'

import type CommerceService from '../../commerce-service'

class LineItemImpl implements LineItem {

  product: Product
  qu: number = 0

  constructor(prod: Product) {
    this.product = prod
    makeAutoObservable(this)
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
    return this.product.sku.includes(`-${id}-`)
  }

}

class TogglableCategoryImpl implements TogglableCategory {

  private _on: boolean = true

  readonly id: string
  readonly title: string
  readonly level: number | undefined 
  readonly desc: string | undefined
  readonly img: string | ImageDef | undefined

  constructor(c: Category) {
    this.id = c.id
    this.title = c.title
    this.level = c.level
    this.desc = c.desc
    this.img = c.img

    makeObservable<TogglableCategoryImpl, '_on' >(this, {
      _on: observable,
    })

    makeObservable(this, {
      isOn: computed,
      setOn: action
    })
  }

  get isOn(): boolean {
    return this._on
  }

  setOn(b: boolean): void {
    this._on = b
  }
}

class StandaloneCommerceService 
  implements CommerceService
{
  private _items: LineItem[]
  private _categories: TogglableCategoryImpl[]

  constructor(
    products: Product[], 
    categories: Category[]=[]
  ) {
    makeObservable(this, {
      cartItems: computed,
      cartItemCount: computed,
      cartTotalValue: computed, 
      specifiedCategories: computed,
      specifiedItems: computed,
      setCategoryStates: action,
      setSpecifiedCategories: action,
    })

    this._items = products.map((p) => (new LineItemImpl(p)))
    this._categories = categories.map((c) => (new TogglableCategoryImpl(c)))
  }

  get cartItems(): LineItem[] {
    const result = this._items.filter((item) => (item.isInCart))
    return result.sort((a, b) => (a.product.sku.localeCompare(b.product.sku)))
  }

  get cartItemCount(): number { 
    const result = this._items.filter((item) => (item.isInCart))
    return result.length
  }
  
  get cartTotalValue(): number {
    return this._items.reduce(
      (total, item) => (total + item.product.price * item.quantity), 
      0
    )
  }

  setSpecifiedCategories(idsToTurnOn: string[] | null): LineItem[] {
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

  setCategoryStates(states: {[key: string]: boolean}): void {
    runInAction(() => {
      this._categories.forEach((c) => {
        if (c.id in states) {
          c.setOn(states[c.id])
        }
      })
    })
  }

  get specifiedCategories(): TogglableCategory[] {
    return this._categories.filter((c) => (c.isOn))  
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

    return result.sort((a, b) => (a.product.sku.localeCompare(b.product.sku)))
  }

  getCategorySubtotal(categoryId: string): number {
    return this._items.reduce((total, item) => (
        (item.inCategory(categoryId)) ? (total + item.product.price * item.quantity) : total 
      ), 
      0
    )
  }

  get allItems(): LineItem[] {return (this._items)}
  get allCategories(): TogglableCategory[] {return (this._categories)}

    // for initial set up ui if cat is known.  Returns the stateful object
  getCategories(ids: string[]): TogglableCategory[] {
    return this._categories.filter((c) => (ids.includes(c.id)))
  }
}

export default StandaloneCommerceService
