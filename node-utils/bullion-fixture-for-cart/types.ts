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
  chn: CategoryData[] | ItemData[]
}

export {
  type ItemData,
  type CategoryData
}