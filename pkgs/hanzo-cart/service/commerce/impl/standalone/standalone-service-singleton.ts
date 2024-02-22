import type CommerceService from '../../service'

import StandaloneCommerceService from './standalone-service'

import products from './bullion-products.json' 
import categoriesObj from './bullion-categories.json'

let instance: CommerceService | undefined =  undefined

export default (): CommerceService => {
  if (instance) return instance

  instance = new StandaloneCommerceService(
    products, 
    Object.values(categoriesObj) 
  )

  return instance
}