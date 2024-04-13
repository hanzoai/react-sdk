import type { ItemSelectorOptions } from './item-selector'

type SingleFamilySelector = 'buttons' | 'carousel' 
type MultiFamilySelector = 'family-carousel' | 'all-variants-carousel'

interface SelectionUISpecifier {
  multiFamily?: {
    type: MultiFamilySelector
      /** Should title of parent node of families.
       * default: true */ 
    showParentTitle: boolean 
    options?: ItemSelectorOptions
  }
  singleFamily?: {
    type: SingleFamilySelector
    options?: ItemSelectorOptions
  } 
}

export {
  type SelectionUISpecifier,
  type ItemSelectorOptions,
  type SingleFamilySelector,
  type MultiFamilySelector
}