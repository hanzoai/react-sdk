import type { Breakpoint } from '../../types'

interface GridDef {
    // Please define in ACCENDING order.
  bkpts: {
    [key in (Breakpoint)]?: number
  },
  mobile?: number 
}

export {
  type GridDef as default
}