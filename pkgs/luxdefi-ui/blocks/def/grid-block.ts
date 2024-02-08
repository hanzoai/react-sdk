import type Block from "./block"
import type GridDef from "./grid-def"

interface GridBlock {
  blockType: 'grid'
  grid: GridDef
  cells: Block[]
}

export {
  type GridBlock as default
}