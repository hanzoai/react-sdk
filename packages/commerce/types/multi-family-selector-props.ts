import type { Dimensions } from '@hanzo/ui/types'

import type Family from './family'
import type { ItemSelectorOptions } from './item-selector'

interface MultiFamilySelectorProps {
  families: Family[]
  initialFamilyId: string
  clx?: string
  itemClx?: string
  itemOptions?: ItemSelectorOptions
  mediaConstraint?: Dimensions
  mobile?: boolean
}

export { type MultiFamilySelectorProps as default }