import type { CommerceService, Category, FacetsDesc } from '../../../types'
import StandaloneService, {type StandaloneServiceOptions} from './standalone-service'


// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18

let instance: CommerceService | undefined =  undefined

export const getInstance =  (categories: Category[], facets: FacetsDesc, options?: StandaloneServiceOptions): CommerceService => {

  if (!options) {
    throw new Error('Standalone Commerce Service require config options!')
  }

  const _instance = instance ?? 
    new StandaloneService(
      categories, 
      facets, 
      options
    )
      // For server side rendering always create a new store
  if (typeof window === "undefined") return _instance

    // Create the store once in the client
  if (!instance) {
    instance = _instance
  }  

  return _instance
}

