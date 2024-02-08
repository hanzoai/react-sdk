import type { Breakpoint } from '../../types'

interface GridDef {
    // Please define in ACCENDING order.
  at: {
    [key in (Breakpoint)]?: number | { columns: number, gap: number}
  },
  mobile?: number | { columns: number, gap: number} 
}

export {
  type GridDef as default
}