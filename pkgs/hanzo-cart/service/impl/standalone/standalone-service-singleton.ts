import type CommerceService from '../../commerce-service'

import StandaloneCommerceService from './standalone-service'

import products from './data/bullion-products.json' 
import categoriesObj from './data/bullion-categories.json'

// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18

let instance: CommerceService | undefined =  undefined

export default (): CommerceService => {

  const _instance = instance ?? new StandaloneCommerceService(
    products, 
    Object.values(categoriesObj) 
  )
      // For server side rendering always create a new store
  if (typeof window === "undefined") return _instance

    // Create the store once in the client
  if (!instance) {
    instance = _instance
  }  

  return _instance
}