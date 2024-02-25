import type CommerceService from '../../commerce-service'

import StandaloneCommerceService from './standalone-service'

import type { Category, Product } from '../../../types'

// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18

let instance: CommerceService | undefined =  undefined

export default (products: Product[], categories?: Category[]): CommerceService => {

  const _instance = instance ?? new StandaloneCommerceService(products, categories)
      // For server side rendering always create a new store
  if (typeof window === "undefined") return _instance

    // Create the store once in the client
  if (!instance) {
    instance = _instance
  }  

  return _instance
}