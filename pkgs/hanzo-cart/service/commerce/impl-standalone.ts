import { makeObservable, observable, action, computed } from "mobx";
import type { Product, Category, LineItem } from "../../types";
import type CommerceService from "./service";

class StandaloneCommerceService 
  //implements CommerceService
{

  private _entireStore: Product[] = []
  private _categories: Category[] = []
  private _lineItems: LineItem[] = []

  constructor(
    all: Product[], 
    categories: Category[]=[]
  ) {

    this._entireStore = all
    this._categories = categories

    makeObservable(this, {
      lineItems: computed,
      itemCount: computed,
      total: computed
    })

    makeObservable<StandaloneCommerceService, | '_lineItems'>(this, {
      _lineItems: action
    })

  } 

  get entireStore(): Product[] {return (this._entireStore)}
  get categories(): Category[] {return (this._categories)}
  get lineItems(): LineItem[] {return (this._lineItems)}
  get itemCount(): number { return (this._lineItems.length) }

  get total(): number {
    return this._lineItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

}

export default StandaloneCommerceService