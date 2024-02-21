import { v4 as unique} from 'uuid'
import type { Product, Category } from '@hanzo/cart/types'

import d from './data/index'

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
  level: number
  img?: string
  desc?: string
  sub: CategoryData[] | ItemData[]
}


const cats = new Map<string, Category>
const products: Product[] = []

const massStringFromItemToken = (t: string): string => {
  const tokens = t.split(TS)
  return tokens[0] + tokens[1].toLowerCase() 
}

const parseCategoryData = (
  cd: CategoryData, 
  titleTokens: string[] = [],
  skuReduced: string = '', 
): Product[] => {

  
  if (cd.sub.length > 1 && 'price' in cd.sub[0]) {
    (cd.sub as ItemData[]).forEach((itemData) => {

      // Lux Bullion, Gold, 1oz Minted Bar
      const bullionForm = titleTokens.pop()
      const previousTitle = titleTokens.join(', ') // so we support n levels

      const p = {
        id: unique(),
        sku: `${skuReduced}-${itemData.t}`,
        title: `${previousTitle}, ${massStringFromItemToken(itemData.t)} ${bullionForm}`,
        desc: itemData.desc ? itemData.desc : cd.desc,
        price: itemData.price,
        img: itemData.img ?? cd.img   
      } satisfies Product
      products.push(p)
    })
  }
  else if (cd.sub.length > 1 && 'sub' in cd.sub[0]) {
    (cd.sub as CategoryData[]).forEach(({
      t,
      label,
      img,
      desc,
      sub  
    }) => {

      titleTokens.push(label)

      const cat = {
        t,
        label,
        level: cd.level + 1,
        img: img ?? cd.img, 
        desc,
        sub,
      } satisfies CategoryData

      const sku_ = `${skuReduced}-${t}`
      parseCategoryData(
        cat,
        titleTokens,
        sku_
      )
    })
  }

  return []
}

parseCategoryData(d as unknown as CategoryData)

console.log(products)