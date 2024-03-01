import React from 'react'

import { Breakpoints} from '../../types'
import { cn } from '../../util'

import type { Block, GroupBlock } from '../def'
import Content from './content'

  // eg: 'layout-grid-2-starting-md'
  // see comments below regarding dynamic classes and the safelist
const getLayoutInfo = (s: string): {
  layout: string
  spec: any
} | undefined => {
  const tokenArray = s.split(' ')
  const layoutToken = tokenArray.find((tok) => (tok.startsWith('layout-')))
  if (layoutToken) {
    const subtokens = layoutToken.split('-')
    const layout = subtokens[1]
    let spec: any = {}
    switch (layout) {
      case 'grid': {
        const columns = parseInt(subtokens[2], 10)
        const starting = subtokens[4]
        if (Number.isNaN(columns) || columns < 2 || columns > 6 || !Breakpoints.includes(starting)) {
          return undefined
        }
        spec = {
          columns,
          starting
        }
      } break
      // no other types supported yet
    } 
    return {
      layout,
      spec
    }
  }
  return undefined
}

const GroupBlockComponent: React.FC<{
  block: Block
  className?: string,
}> = ({
  block,
  className=''
}) => {

  if (block.blockType !== 'group') {
    return <>group block required</>
  }

  const group = block as GroupBlock

    // only one supported so fat
  if (group.specifiers?.includes('layout')) {
    const layoutSpec = getLayoutInfo(group.specifiers)
    if (!layoutSpec) {
      return <>invalid or missing layout specifier in group block!</>
    }

    if (layoutSpec.layout === 'grid') {
      const { elements } = group
      const { spec: {starting, columns} } = layoutSpec 

        // https://tailwindcss.com/docs/content-configuration#dynamic-class-names
        // All variants in use MUST be in style/safelist.tailwind.js
      const clazzName = cn('grid xs:grid-cols-1 gap-2 sm:gap-3',
        `${starting}:grid-cols-${columns} `, 
        className)
      return (
        <div className={clazzName}>
          <Content blocks={elements} />
        </div>
      )
    }
  }
  return null
}

export default GroupBlockComponent
