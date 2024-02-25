import { v4 as unique} from 'uuid'
import type { Product, Category } from '@hanzo/cart/types'

import { type ItemImportData, type CategoryData } from './types'

import { 
  IMG, 
  IMG_LEVEL_3, 
  ASSETS_PATH, 
  OUT_DIR, 
  CAT_FN,
  PROD_FN,
  TS,
  DEC,
  ROOT
} from './config'

const allCategories: any = {}
const allProducts: Product[] = []

const getAmount = (t: string): string => {
  const tokens = t.split(TS)
  const amount = tokens[0].includes(DEC) ? tokens[0].split(DEC).join('.') : tokens[0]
  const unit = tokens[1].toLowerCase()
  return amount + unit
}

const visitCategoryData = (
  category: CategoryData, 
  titleTokens: string[] = [],
  skuTokens: string[] = [], 
): void => {

  const tToken = category.titleToken ?? category.label
    // otherwise extra comma if titleToken is '' at this level
  if (tToken?.length > 0) {
    titleTokens.push(tToken)   
  }

  skuTokens.push(category.t)

    // from CategoryData to hanzo Category
  allCategories[category.t] = {
    id: category.t,
    title: category.label,
    skuPath: skuTokens.join(TS),
    level: category.level ?? 1,
    desc: category.desc,
    img: category.img,
  } satisfies Category


  if (category.ch.length > 0 && 'price' in category.ch[0]) {

      // Since we are at the leaf level,
      // these are valid for the entire array.
    const bullionForm = titleTokens.pop()
    const previousTitle = titleTokens.join(', ')

    const products = category.ch as ItemImportData[]

    products.forEach((prod) => {
        // from ProductData to hanzo Product
      allProducts.push({
        id: unique(),
          // add myself to the string
        sku: [...skuTokens, prod.t].join('-'), 
          // Desired result: "Lux Bullion, Gold, 1oz Minted Bar", ie,
          //  `<previous title tokens joined>, <amount> <form>`
        title: `${previousTitle}, ${getAmount(prod.t)} ${bullionForm}`,
        desc: prod.desc ? prod.desc : category.desc,
        price: prod.price,
        img: ASSETS_PATH + IMG[prod.img ?? category.img!]   
      } satisfies Product)
    })
  }
  else if (category.ch.length > 0 && 'ch' in category.ch[0]) {

    const {level: parentLevel, img: parentImg, desc: parentDesc} = category
    const subCategories = category.ch as CategoryData[]
    
    subCategories.forEach(({t, label, img, desc, ch}) => {
      visitCategoryData({
          t,
          label,
          level: (parentLevel ?? 1) + 1,
          img: img ?? parentImg, 
          desc: desc ?? parentDesc,
          ch,
        } satisfies CategoryData,
          // Each branch (ch category) must have it's own fresh copies to reduce
        [...titleTokens], 
        [...skuTokens]
      )
    })
  }
}

visitCategoryData(ROOT as unknown as CategoryData)

const keys = Object.keys(allCategories)
keys.forEach((key) => {
  if (allCategories[key].img) {
    allCategories[key].img = ASSETS_PATH + IMG[allCategories[key].img] 
/*
    if (allCategories[key].level === 3) {
      allCategories[key].img = ASSETS_PATH + IMG_LEVEL_3[allCategories[key].id] 
    }
    else {
      allCategories[key].img = ASSETS_PATH + IMG[allCategories[key].img] 
    }
*/
  }

})

console.log(`Writing products to ${OUT_DIR + PROD_FN}...`)
Bun.write(OUT_DIR + PROD_FN, JSON.stringify(allProducts, null, 2))
console.log(`Writing categories as objects to ${OUT_DIR + CAT_FN}...`)
Bun.write(OUT_DIR + CAT_FN, JSON.stringify(allCategories, null, 2))
console.log('done')
