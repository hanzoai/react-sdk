import { makeObservable, observable, action, computed, remove, runInAction } from 'mobx'
import type { Product, Category, LineItem } from '../../../../types'
import type CommerceService from '../../service'

class LineItemImpl implements LineItem {

  product: Product
  @observable quantity: number = 1

  constructor(prod: Product) {
    this.product = prod
  }
}

class StandaloneCommerceService 
  implements CommerceService
{
  private _entireStore: Product[] = []
  private _categories: Category[] = []

  private _cartContents: LineItem[] = []

  private _specifiedCategories: Category[] = []

  constructor(
    all: Product[], 
    categories: Category[]=[]
  ) {

    this._entireStore = all
    this._categories = categories

    makeObservable<StandaloneCommerceService, 
      '_cartContents' |
      '_addToCart' | 
      '_removeFromCart' |
      '_specifiedCategories'
    >(this, {
      _cartContents: observable.shallow,
      _addToCart: action,  
      _removeFromCart: action, 
      _specifiedCategories: observable.shallow,
    })
  } 

  get entireStore(): Product[] {return (this._entireStore)}
  get allCategories(): Category[] {return (this._categories)}

  @computed
  get cartContents(): LineItem[] {return (this._cartContents)}
  
  @computed
  get itemCount(): number { return (this._cartContents.length) }
  
  @computed
  get cartTotal(): number {
    return this._cartContents.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  _addToCart(id: string) {
    const prod = this._entireStore.find((el => (el.sku === id)))
    if (prod) {
      this._cartContents.push(new LineItemImpl(prod))
    }
    throw new Error('_addToCart: Trying to add an ID not in the store.')
  }

  _removeFromCart(id: string) {
      //runInAction(() => {
    const index = this._cartContents.findIndex((el => (el.product.sku !== id)))
    if (index > -1) {
      remove(this._cartContents, `${index}`)
    }
        //this._cartContents = this._cartContents.filter((el => (el.product.sku !== id)))
      //})
  }

  _getLineItem(id: string): LineItem | undefined {
    return this._cartContents.find((el => (el.product.sku === id)))
  }
  
  @action
  incrementQuantity(productId: string) {
    const found = this._getLineItem(productId)
    if (found) {
      found.quantity++
    }
    else {
      this._addToCart(productId)
    }
  }

  @action
  decrementQuantity(productId: string) {
    const found = this._getLineItem(productId)
    if (found) {
      if (found.quantity === 1) {
        this._removeFromCart(productId)
      }
      else {
        found.quantity--
      }
    }
  }
    // https://mobx.js.org/computeds-with-args.html#1-derivations-dont-_need_-to-be-computed
    // https://mobx.js.org/computeds-with-args.html#2-close-over-the-arguments
  getQuantity(productId: string) {
    return computed(() => {
      const found = this._getLineItem(productId)
      if (found) {
        return found.quantity
      }
      return 0    
    }).get()
  }

  setSpecifiedCategories(categoryIds: string[] | null): Product[] {
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
    return this.specifiedProducts
  }

  @computed
  get specifiedCategories(): Category[] {
    return this._specifiedCategories  
  }

  @computed
  get specifiedProducts(): Product[] {
    let result: Product[] = []
    if (this._specifiedCategories.length > 0) {
      result = this._entireStore.filter((prod) => (
        this._specifiedCategories.some((cat) => (prod.sku.includes(cat.id)))
      ))
    }
    result = [...this._entireStore]
    return result.sort((a, b) => (a.sku.localeCompare(b.sku)))
  }

  getCategorySubtotal(categoryId: string): number {
    const lineItemsInCat = this._cartContents.filter((item) => (item.product.sku.includes(categoryId)))
    return lineItemsInCat.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

}

export default StandaloneCommerceService
