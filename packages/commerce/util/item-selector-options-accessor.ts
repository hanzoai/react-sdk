import type { ItemSelectorOptions } from '../types'

export default (options: ItemSelectorOptions | undefined = {}): Required<ItemSelectorOptions> => {

  const showFamilyTitle = 'showFamilyTitle' in options ? options.showFamilyTitle! : true
  const showFamilyByline = 'showFamilyByline' in options ? options.showFamilyByline! : false

  const showFamilyInOption = 'showFamilyInOption' in options ? options.showFamilyInOption! : false
  const showByline = 'showByline' in options ? options.showByline! : true

  const showPrice = 'showPrice' in options ? options.showPrice! : true
  const showQuantity = 'showQuantity' in options ? options.showQuantity! : false

  const buttonType = 'buttonType' in options ? options.buttonType! : 'text'
  const horizButtons = 'horizButtons' in options ? options.horizButtons! : false
  const showSlider = 'showSlider' in options ? options.showSlider! : true

  const sort = 'sort' in options ? options.sort! : 'none'

  return {
    showFamilyInOption,
    showFamilyTitle, 
    showFamilyByline,
    showByline,
    showPrice,
    showQuantity,
    buttonType,
    horizButtons,
    showSlider,
    sort
  }
}