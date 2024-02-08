import React, { type PropsWithChildren } from 'react'

import { cn } from '../../util'

import type { GridBlock } from '../def'
import Content from './content'

import type BlockComponentProps from './block-component-props'

const gridClx = (d: number | { columns: number, gap: number}, prefix?: string ): string => (
  (typeof d === 'number') ? 
    `${(prefix ?? '')}grid-cols-${d} ` 
    : 
    `${(prefix ?? '')}grid-cols-${d.columns} ${(prefix ?? '')}gap-${d.gap} ` 
)

const GridBlockComponent: React.FC<
  BlockComponentProps & PropsWithChildren
> = ({
  block,
  className='',
  agent,
  children
}) => {

  if (block.blockType !== 'grid') {
    return <>grid block required</>
  }

  const { cells, grid } = block as GridBlock

    // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
    // All variants in use MUST be in style/safelist.tailwind.js
  let clx = 'grid '
  if (agent === 'phone') {
    const d = (grid.mobile) ? grid.mobile : (grid.at.xs ? grid.at.xs : grid.at.sm!);
    clx += gridClx(d)
  }
  else {
    let defaultSet = false
    for (const [key, value] of Object.entries(grid.at)) {
      if (!defaultSet) {
        clx += gridClx(value)
        defaultSet = true
      }
      else {
        clx += gridClx(value, `${key}:`)
      }
    }   
  }

  return (
    <div className={cn('grid gap-2 md:gap-4 xl:gap-6', clx, className)}>
    {cells?.length ? (
        <Content blocks={cells} />
      ) : children
    }
    </div>
  )
}

export default GridBlockComponent
