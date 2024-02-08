import React from 'react'

import { cn } from '../../util'

import type { GridBlock } from '../def'
import Content from './content'

import type BlockComponentProps from './block-component-props'

const GridBlockComponent: React.FC<BlockComponentProps> = ({
  block,
  className='',
  agent
}) => {

  if (block.blockType !== 'grid') {
    return <>grid block required</>
  }

  const { cells, grid } = block as GridBlock

    // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
    // All variants in use MUST be in style/safelist.tailwind.js
  let clx = 'grid '
  if (agent === 'phone') {
    clx += (grid.mobile) ? grid.mobile : (grid.bkpts.xs ? grid.bkpts.xs : grid.bkpts.sm)
  }
  else {
    let defaultSet = false
    for (const [key, value] of Object.entries(grid.bkpts)) {
      if (!defaultSet) {
        clx += `grid-cols-${value} `
        defaultSet = true
      }
      else {
        clx += `${key}:grid-cols-${value} `
      }
    }   
  }

  return (
    <div className={cn('grid gap-2 md:gap-4 xl:gap-6', clx, className)}>
      <Content blocks={cells} />
    </div>
  )
}

export default GridBlockComponent
