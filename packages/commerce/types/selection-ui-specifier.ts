type InSlideSelector = 'buttons' | 'image-buttons' | 'horiz-image-buttons' 
type SingleFamilySelector = 'buttons' | 'image-buttons' | 'carousel' 

interface SelectionUISpecifier {
  multiFamily?: {
    family: 'carousel'
    inSlide: InSlideSelector
  }
  singleFamily?: SingleFamilySelector 
}

export {
  type SelectionUISpecifier,
  type InSlideSelector,
  type SingleFamilySelector
}