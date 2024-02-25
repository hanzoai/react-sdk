interface ItemImportData {
  tok: string
  price: number
  img?: string
  desc?: string
}

interface LevelImportData {
  tok: string
  titleToken?: string
  label: string
  level: number
  img?: string
  desc?: string
  ch: LevelImportData[] | ItemImportData[]
}

export {
  type ItemImportData,
  type LevelImportData
}