import React, {type ElementType} from 'react'

import type { EnhHeadingBlock } from '../def'
import { ApplyTypography } from '../../primitives'

import type BlockComponentProps from './block-component-props'
import type { Icon } from '../..'

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

const EnhHeadingBlockComponent: React.FC<
  BlockComponentProps & {
  applyTypography: boolean
}> = ({
  block,
  className='',
  applyTypography=true
}) => {

  if (block.blockType !== 'enh-heading') {
    return <>enhance heading block required</>
  }
  const b = block as EnhHeadingBlock

  const Inner: React.FC = () => {
    const toRender = [
      {
        tag: (b.preheading) ? 
          (b.preheading.level ? tagFromLevel(b.preheading.level) : DEFAULTS.preheading.tag) 
          : 
          undefined, 
        clx: (b.preheading) ? 
          (b.preheading.mb ? `mb-${b.preheading.mb}` : `mb-${DEFAULTS.preheading.mb}`) 
          : 
          '',
        text: (b.preheading) ? (b.preheading.text ) : undefined,
      },
      {
        tag: (b.heading.level ? tagFromLevel(b.heading.level) : DEFAULTS.heading.tag), 
        clx: (b.heading.mb ? `mb-${b.heading.mb}` : `mb-${DEFAULTS.heading.mb}`),
        text: b.heading.text,
      },
      {
        tag: (b.byline) ? 
          (b.byline.level ? tagFromLevel(b.byline.level) : DEFAULTS.byline.tag) 
          : 
          undefined, 
        clx: '',
        text: (b.byline) ? (b.byline.text ) : undefined,
      },
    ] as {
      tag: ElementType
      clx: string
      text: string
    }[]

    return <>
      {toRender.map(({tag, clx, text}, index) => (
        <Element asTag={tag} text={text} className={clx} key={`el-${index}`}/>
      ))}
    </>
  }

  return applyTypography ? (
    <ApplyTypography className={className}>
      <Inner />
    </ApplyTypography>
  ) : (
    <div className={className}>
      <Inner />  
    </div>
  )
}

export default EnhHeadingBlockComponent
