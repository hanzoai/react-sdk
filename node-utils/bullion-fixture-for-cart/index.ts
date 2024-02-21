import type { Product } from '@hanzo/cart/types'

import d from './data'

const TS = '-' // token separator

interface ItemData {
  t: string
  price: number
  img?: string
  desc?: string
}

interface CategoryData {
  t: string
  label: string
  labelLong?: string
  img?: string
  desc?: string
  sub: CategoryData[] | ItemData[]
}


const parseCategoryData = (cd: CategoryData): Product[] => {

  return []
}