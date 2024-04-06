type InSlideSelector = 'buttons' | 'image-buttons' | 'horiz-image-buttons' 
type JustVariantSelector = 'buttons' | 'image-buttons' | 'carousel' 

interface SelectionUISpecifier {
  multiFamily?: {
    family: 'carousel'
    inSlide: InSlideSelector
  }
  justVariant?: JustVariantSelector 
}

export {
  type SelectionUISpecifier,
  type InSlideSelector,
  type JustVariantSelector
}