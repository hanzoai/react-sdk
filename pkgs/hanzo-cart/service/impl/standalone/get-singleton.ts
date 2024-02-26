import type CommerceService from '../../commerce-service'

import StandaloneCommerceService from './service'

import type { Category, Facets } from '../../../types'

// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18

let instance: CommerceService | undefined =  undefined

export default (categories: Category[], facets: Facets): CommerceService => {

  const _instance = instance ?? new StandaloneCommerceService(categories, facets)
      // For server side rendering always create a new store
  if (typeof window === "undefined") return _instance

    // Create the store once in the client
  if (!instance) {
    instance = _instance
  }  

  return _instance
}