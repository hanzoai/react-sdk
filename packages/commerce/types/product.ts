import type { MediaStackDef } from '@hanzo/ui/types'

interface Product extends MediaStackDef {
  id: string    // DB index // not a logical aspect of our domain.  may not be necessary at all
  sku: string   // human visible on orders etc.
  fullTitle?: string
  optionLabel: string
  familyId: string  // skuPath, eg LXB-AU-B
  familyTitle: string
  desc?: string
  price: number
}

export {
  type Product as default
}