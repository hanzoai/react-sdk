import { makeObservable, observable, action, computed, remove, runInAction } from 'mobx'
import type { Product, Category, LineItem } from '../../../../types'
import type CommerceService from '../../service'

class LineItemImpl implements LineItem {

  product: Product
  @observable qu: number = 0

  constructor(prod: Product) {
    this.product = prod
  }

  @computed
  get canDecrement(): boolean {
    return this.qu > 0
  }

  @computed 
  get quantity(): number {return this.qu}

  @computed
  get isInCart(): boolean {return this.qu > 0}

  @action.bound
  increment(): void {
    this.qu++
  }

  @action.bound 
  decrement(): void {
    if (this.qu > 0) {
      this.qu--
    }
  }
  
}

class StandaloneCommerceService 
  implements CommerceService
{
  private _entireStore: LineItem[]
  private _categories: Category[]
  private _specifiedCategories: Category[] = []

  constructor(
    products: Product[], 
    categories: Category[]=[]
  ) {

    this._entireStore = products.map((p) => (new LineItemImpl(p)))
    this._categories = categories

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
  }

  get entireStore(): LineItem[] {return (this._entireStore)}
  get allCategories(): Category[] {return (this._categories)}

  get cartItems(): LineItem[] {
    const result = this._entireStore.filter((item) => (item.isInCart))
    return result.sort((a, b) => (a.product.sku.localeCompare(b.product.sku)))
  }

  get cartItemCount(): number { 
    const result = this._entireStore.filter((item) => (item.isInCart))
    return result.length
  }
  
  get cartTotalValue(): number {
    return this._entireStore.reduce(
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
      result = this._entireStore.filter((item) => (
        this._specifiedCategories.some((cat) => (item.product.sku.includes(cat.id)))
      ))
    }
    else {
      result = [...this._entireStore]
    }
    return result.sort((a, b) => (a.product.sku.localeCompare(b.product.sku)))
  }

  getCategorySubtotal(categoryId: string): number {
    const lineItemsInCat = this._cartContents.filter((item) => (item.product.sku.includes(categoryId)))
    return lineItemsInCat.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }
}

export default StandaloneCommerceService
