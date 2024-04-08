import type { ItemSelectorOptions } from './item-selector'
type SelectorType = 'buttons' | 'carousel' 


interface SelectionUISpecifier {
  multiFamily?: {
    family: 'carousel'
    inSlide: {
      type: 'buttons'
      options?: ItemSelectorOptions
    }
  }
  singleFamily?: {
    type: SelectorType
    options?: ItemSelectorOptions
  } 
}

export {
  type SelectionUISpecifier,
  type SelectorType
}