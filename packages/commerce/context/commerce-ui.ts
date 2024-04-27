import { 
  action,
  computed, 
  makeObservable, 
  observable, 
} from 'mobx'
import type { CommerceService } from '../types'



interface CommerceUI {
  showBuyOptions: (skuPath: string) => void
  hideBuyOptions: () => void
  get buyOptionsSkuPath(): string | undefined

  skuQuantityChanged(sku: string, val: number, prevVal: number): void 
  get activeSku(): string | undefined
}

class CommerceUIStore implements CommerceUI {

  static readonly TIMEOUT = 2500
  _buyOptionsSkuPath: string | undefined = undefined
  _activeSku: string | undefined = undefined
  _lastActivity: number | undefined = undefined
  _service: CommerceService

  constructor(s: CommerceService) {
    this._service = s
    makeObservable(this, {
      _buyOptionsSkuPath: observable,
      _activeSku: observable, 
      showBuyOptions: action,
      hideBuyOptions: action,
      buyOptionsSkuPath: computed,
      skuQuantityChanged: action,
      tick: action,
      activeSku: computed
    })
  }

  showBuyOptions = (skuPath: string): void => {
    this._service.setCurrentItem(undefined)
    this._buyOptionsSkuPath = skuPath
  } 

  hideBuyOptions = (): void => {
    this._buyOptionsSkuPath = undefined
  }

  get buyOptionsSkuPath(): string | undefined {
    return this._buyOptionsSkuPath
  } 

  tick = () => {
    if (
      this._lastActivity 
      && 
      (Date.now() - this._lastActivity >= CommerceUIStore.TIMEOUT)
    ) {
      this._activeSku = undefined
      this._lastActivity = undefined
    }
  }

  skuQuantityChanged = (sku: string, val: number, oldVal: number, ): void  => {

    if (val === 0) {
      if (this._activeSku === sku) {
        this._activeSku = undefined
        this._lastActivity = undefined
      }
      // otherwise ignore
    }
    else if (val < oldVal) {
      if (this._activeSku === sku) {
        this._lastActivity = Date.now()
      }
      // otherwise ignore
    }
    else {
        this._activeSku = sku
        this._lastActivity = Date.now()
    }
  } 

  get activeSku(): string | undefined {
    return this._activeSku
  }
}

export {
  CommerceUIStore,
  type CommerceUI
}