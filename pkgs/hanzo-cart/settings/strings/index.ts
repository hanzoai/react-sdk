import Strings from './Strings'

const APP_NAME = 'Karma'
const inst = new Strings([
  ['appTitleShortLower', 'karma'],
  ['appTitleShortCaps', APP_NAME],
  ['appTitleFull', APP_NAME],
  ['appTitleLegal', 'Karma Bikinis LLC'],
  ['copyright', 'Copyright © 2020'],
  ['allRights', 'All Rights Reserved'],
  ['contactUs', 'Contact Us'],
  ['searchResults', 'Search Results'],
  ['product', 'product'],  
  ['productCaps', 'Product'],  
  ['productPlural', 'products'],
  ['productPluralCaps', 'Products'],
])

export default (key: string, d?: string): string => (inst.get(key, d))
export { APP_NAME }