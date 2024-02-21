import { v4 as unique} from 'uuid'
import type { Product, Category } from '@hanzo/cart/types'

import d from './data/index.js'

const TS = '-' // token separator

interface ItemData {
  t: string
  price: number
  img?: string
  desc?: string
}

interface CategoryData {
  t: string
  titleToken?: string
  label: string
  level: number
  img?: string
  desc?: string
  sub: CategoryData[] | ItemData[]
}

//const cats = new Map<string, Category>
const products: Product[] = []

const massStringFromItemToken = (t: string): string => {
  const tokens = t.split(TS)
  return tokens[0] + tokens[1].toLowerCase() 
}

const parseCategoryData = (
  parent: CategoryData, 
  titleTokens: string[] = [],
  skuTokens: string[] = [], 
): Product[] => {

  const tToken = parent.titleToken ?? parent.label
    // otherwise extra comma if titleToken is '' at this level
  if (tToken?.length > 0) {
    titleTokens.push(tToken)   
  }
  skuTokens.push(parent.t)

  if (parent.sub.length > 0 && 'price' in parent.sub[0]) {

    (parent.sub as ItemData[]).forEach((item) => {

      // Lux Bullion, Gold, 1oz Minted Bar
      const bullionForm = titleTokens.pop()
      const previousTitle = titleTokens.join(', ') // so we support n levels

      skuTokens.push(item.t)
      const sku = skuTokens.join('-')

      const p = {
        id: unique(),
        sku,
        title: `${previousTitle}, ${massStringFromItemToken(item.t)} ${bullionForm}`,
        desc: item.desc ? item.desc : parent.desc,
        price: item.price,
        img: item.img ?? parent.img   
      } satisfies Product
      products.push(p)
    })
  }
  else if (parent.sub.length > 0 && 'sub' in parent.sub[0]) {
    (parent.sub as CategoryData[]).forEach(({t, label, img, desc, sub}) => {
      parseCategoryData({
          t,
          label,
          level: parent.level + 1,
          img: img ?? parent.img, 
          desc: desc ?? parent.desc,
          sub,
        } satisfies CategoryData,
          // each sub category must have it's own branch
        [...titleTokens], 
        [...skuTokens]
      )
    })
  }

  return []
}

parseCategoryData(d as unknown as CategoryData)

console.log(products)