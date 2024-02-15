import React, {type ElementType} from 'react'

import type { Icon } from '../../types'
import type { EnhHeadingBlock } from '../def'
import { ApplyTypography } from '../../primitives'
import { cn, containsToken } from '../../util'

import type BlockComponentProps from './block-component-props'
import InlineIcon from '../../primitives/inline-icon'

const DEFAULTS = {
  preheading: {
    tag: 'h4' as ElementType,
    mb: 2
  },
  heading: {
    tag: 'h1' as ElementType,
    mb: 2
  },
  byline: {
    tag: 'h6' as ElementType,
  }
}

const tagFromLevel = (level: number): ElementType => {
  switch (level) {
    case 1: {
      return 'h1'
    } 
    case 2: {
      return 'h2'
    } 
    case 3: {
      return 'h3'
    } 
    case 4: {
      return 'h4'
    } 
    case 5: {
      return 'h5'
    } 
    case 6: {
      return 'h6'
    } 
  }
  return 'p'
}

  // TODO Impl icon support
const Element: React.FC<{
  asTag: ElementType 
  text: string
  icon?: Icon
  iconLeft?: boolean
  className?: string
}> = ({
  asTag: Tag,
  text,
  icon,
  iconLeft=true,
  className : elClassName=''
}) => (
  <Tag className={elClassName}>{text}</Tag>
)

const getPositionClx = (
  specified: (s: string) => boolean,
  agent: string | undefined
): {
  preheading: string 
  heading: string
  byline: string
} => {

  const mobileHeadingCentered = specified('mobile-heading-centered')
  const headingCentered = specified('center')
  const headingRight = specified('right')
  const bylineCentered = specified('byline-center')
  const bylineRight = specified('byline-right')

  let headerclx = ''
  if (agent === 'phone') {
    headerclx = (mobileHeadingCentered || headingCentered) ? 
      'self-center text-center' : (headingRight ? 'self-end text-right' : 'self-start text-left')
  }
  else {
    const largerclx = (headingCentered) ? 
      'self-center text-center' : (headingRight ? 'self-end text-right' : 'self-start text-left')

    if (mobileHeadingCentered) {
      headerclx = 'self-center text-center md:' + largerclx.split(' ').join(' md:')
    }
    else {
      headerclx = largerclx 
    }
  }

  const bylineclx = (bylineCentered) ? 
    'self-center' : (bylineRight ? 'self-end' : 'self-start')

  return {
    preheading: headerclx,
    heading: headerclx,
    byline: bylineclx
  }
}

const EnhHeadingBlockComponent: React.FC<
  BlockComponentProps & {
  applyTypography?: boolean
  extraSpecifiers?: string
}> = ({
  block,
  className='',
  agent,
  applyTypography=true,
  extraSpecifiers=''
}) => {

  if (block.blockType !== 'enh-heading') {
    return <>enhance heading block required</>
  }
  const b = block as EnhHeadingBlock
  const specified = (s: string) => (containsToken(b.specifiers + extraSpecifiers, s))
  const preheadingHeadingFont = specified('preheading-heading-font')
  const phFontClx = preheadingHeadingFont ? 'font-heading' : ''
  const alignMiddleClx = specified('align-middle') ? 'my-auto' : ''

  const positionclx = getPositionClx(specified, agent)

  const Inner: React.FC = () => {
    const toRender = [
      {
        tag: (b.preheading) ? 
          (b.preheading.level !== undefined  ? tagFromLevel(b.preheading.level) : DEFAULTS.preheading.tag) 
          : 
          undefined, 
        clx: (b.preheading) ? 
          (b.preheading.mb !== undefined ? 
            `mb-${b.preheading.mb}` : `mb-${DEFAULTS.preheading.mb}`) + ' ' + positionclx.preheading + ' ' + phFontClx
          : 
          positionclx.preheading + ' ' + phFontClx,
        text: (b.preheading) ? (b.preheading.text ) : undefined,
      },
      {
        tag: (b.heading.level !== undefined ? tagFromLevel(b.heading.level) : DEFAULTS.heading.tag), 
        clx: (b.heading.mb !== undefined ? `mb-${b.heading.mb}` : `mb-${DEFAULTS.heading.mb}`) + ' ' + positionclx.heading,
        text: b.heading.text,
      },
      {
        tag: (b.byline) ? 
          (b.byline.level !== undefined ? tagFromLevel(b.byline.level) : DEFAULTS.byline.tag) 
          : 
          undefined, 
        clx: positionclx.byline,
        text: (b.byline) ? (b.byline.text ) : undefined,
      },
    ] as {
      tag: ElementType
      clx: string
      text: string
    }[]

    let iconRendered = false
    return <>
      {toRender.map(({tag, clx, text}, index) => {
        if (!tag) return null
        if (b.icon && !iconRendered) {
          iconRendered = true
          return (
            <div className={cn('flex flex-row items-center gap-2 sm:gap-4', clx)} key={`div-${index}`}>
              <InlineIcon icon={b.icon} size={b.iconSize ?? 32} agent={agent}/>
              <Element asTag={tag} text={text} />
            </div>
          )
        }
        return (
          (<Element asTag={tag} text={text} className={clx} key={`el-${index}`}/>)
        )
      })}
    </>
  }

  return applyTypography ? (
    <ApplyTypography className={cn('flex flex-col w-full !gap-0', className, alignMiddleClx)}>
      <Inner />
    </ApplyTypography>
  ) : (
    <div className={cn('flex flex-col w-full gap-0', className, alignMiddleClx)}>
      <Inner />  
    </div>
  )
}

export default EnhHeadingBlockComponent
