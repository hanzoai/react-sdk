import { 
  action,
  computed, 
  makeObservable, 
  observable, 
} from 'mobx'



interface CommerceUI {
  showBuyOptions: (skuPath: string) => void
  hideBuyOptions: () => void
  get buyOptionsSkuPath(): string | undefined

  addRecentSku(s: string): void 
  removeRecentSku(s: string): void 
  get recentSku(): string | undefined
}

class CommerceUIStore implements CommerceUI {

  _buyOptionsSkuPath: string | undefined = undefined
  _recentSkus: string[] = []

  constructor() {
    makeObservable(this, {
      _buyOptionsSkuPath: observable,
      _recentSkus: observable.shallow, 
      showBuyOptions: action,
      hideBuyOptions: action,
      buyOptionsSkuPath: computed,
      addRecentSku: action,
      removeRecentSku: action,
      recentSku: computed
    })
  }

  showBuyOptions = (skuPath: string): void => {
    this._buyOptionsSkuPath = skuPath
  } 

  hideBuyOptions = (): void => {
    this._buyOptionsSkuPath = undefined
  }

  get buyOptionsSkuPath(): string | undefined {
    return this._buyOptionsSkuPath
  } 

  addRecentSku = (s: string): void  => {
    this.removeRecentSku(s)
    this._recentSkus.push(s)
  } 

  removeRecentSku = (s: string): void  => {
    const i = this._recentSkus.indexOf(s)
    if (i !== -1) {
      this._recentSkus.splice(i, 1)
    }
  } 

  get recentSku(): string | undefined {
    return this._recentSkus.length === 0 ? undefined : this._recentSkus.slice(-1)[0]   
  }
}

export {
  CommerceUIStore,
  type CommerceUI
}