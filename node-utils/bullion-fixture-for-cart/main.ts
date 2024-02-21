import { v4 as unique} from 'uuid'
import type { Product, Category } from '@hanzo/cart/types'
import {
  type ItemData,
  type CategoryData
} from './types'

import d from './data/root'

const TS = '-' // token separator
const ASSETS_PATH = 'assets/img/cart/'
const IMG = {
  AU_B: 'gold-bar-700x700.png',
  AG_B: 'silver-bar-700x700.png',
  AU_C: 'gold-coin-700x700.png',
  AG_C: 'silver-coin-700x700.png',
  AU_MB: 'gold-multibar-700x700.png',
  AG_MB: 'silver-multibar-700x700.png',
  B: 'gold-silver-bars-700x700.png',
  C: 'gold-silver-coins-700x700.png',
}

const categories: any = {}
const products: Product[] = []

const massStringFromItemToken = (t: string): string => {
  const tokens = t.split(TS)
  const amount = tokens[0].includes('_') ? tokens[0].split('_').join('.') : tokens[0]
  const unit = tokens[1].toLowerCase()
  return amount + unit
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
  const cat = {
    id: parent.t,
    title: parent.label,
    level: parent.level,
    desc: parent.desc,
    img: parent.img,
  } satisfies Category

  categories[cat.id] = cat

  if (parent.sub.length > 0 && 'price' in parent.sub[0]) {

    (parent.sub as ItemData[]).forEach((item) => {

      const _titleTokens = [...titleTokens]

      // Lux Bullion, Gold, 1oz Minted Bar
      const bullionForm = _titleTokens.pop()
      const previousTitle = _titleTokens.join(', ') // so we support n levels

      const _skuTokens = [...skuTokens, item.t]
      const sku = _skuTokens.join('-')

      const p = {
        id: unique(),
        sku,
        title: `${previousTitle}, ${massStringFromItemToken(item.t)} ${bullionForm}`,
        desc: item.desc ? item.desc : parent.desc,
        price: item.price,
        img: ASSETS_PATH + IMG[item.img ?? parent.img!]   
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

categories.B.img = '/'

Bun.write('bullion-categories.json', JSON.stringify(categories, null, 2))
Bun.write('bullion.json', JSON.stringify(products, null, 2))
console.log('done')
