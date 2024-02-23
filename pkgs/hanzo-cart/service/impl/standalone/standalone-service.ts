import { 
  makeObservable, 
  observable, 
  action, 
  computed, 
  runInAction, 
  makeAutoObservable
} from 'mobx'

import type { Product, Category, LineItem } from '../../../types'
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
}

class StandaloneCommerceService 
  implements CommerceService
{
  private _items: LineItem[]
  private _categories: Category[]
  private _specifiedCategories: Category[] = []

  constructor(
    products: Product[], 
    categories: Category[]=[]
  ) {
    makeObservable<StandaloneCommerceService, 
      '_specifiedCategories'
    >(this, {
      _specifiedCategories: observable.shallow,
    })

    makeObservable(this, {
      cartItems: computed,
      cartItemCount: computed,
      cartTotalValue: computed, 
      specifiedCategories: computed,
      specifiedItems: computed,
    })

    this._items = products.map((p) => (new LineItemImpl(p)))
    this._categories = categories
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

  setSpecifiedCategories(categoryIds: string[] | null): LineItem[] {
    runInAction(() => {
      if (categoryIds == null || categoryIds.length === 0) {
        this._specifiedCategories = []
      } 
      else {
        this._specifiedCategories = this._categories.filter((cat) => (
          categoryIds.includes(cat.id)
        )) 
      }
    })
    return this.specifiedItems
  }

  get specifiedCategories(): Category[] {
    return this._specifiedCategories  
  }

  get specifiedItems(): LineItem[] {
    let result: LineItem[] = []
    if (this._specifiedCategories.length > 0) {
      result = this._items.filter((item) => (
        this._specifiedCategories.some((cat) => (item.product.sku.includes(cat.id)))
      ))
    }
    else {
      result = [...this._items]
    }
    return result.sort((a, b) => (a.product.sku.localeCompare(b.product.sku)))
  }

  getCategorySubtotal(categoryId: string): number {
    return this._items.reduce((total, item) => (
        (item.product.sku.includes(categoryId)) ? (total + item.product.price * item.quantity) : total 
      ), 
      0
    )
  }

  get allItems(): LineItem[] {return (this._items)}
  get allCategories(): Category[] {return (this._categories)}
}

export default StandaloneCommerceService
