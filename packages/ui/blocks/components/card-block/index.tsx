import React from 'react'

import type { LinkDef, TShirtDimensions  } from  '../../../types'

import {
  ApplyTypography,  
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type TypographySize
} from '../../../primitives'

import type { CardBlock } from '../../def'

import ImageBlockComponent from '../image-block'
import VideoBlockComponent from '../video-block'
import CTABlockComponent from '../cta-block'
import type BlockComponentProps from '../block-component-props'
import { cn } from '../../../util'

import { getTypographySize } from './util'
import LinkOutButton from './link-out-button'

const CardBlockComponent: React.FC<BlockComponentProps & {
  contentClassName?: string
}> = ({
  block,
  className='',
  contentClassName=''
}) => {

  if (block.blockType !== 'card') {
    return <>card block required</>
  }

  const card = block as CardBlock
  const has = (s: string) => (card.specifiers?.includes(s))  

  const ghost = has('ghost') // no outer padding, no borders, larger title, all left-aligned bg is same (default)

  const contentclx = (has('content-left') ? 'items-start ' : ' items-center ') + (has('content-top') ? '!justify-start' : '') + contentClassName
  const disabledBorder = (has('appear-disabled' ) ? ' border-muted-4' : ' border-muted-3')
  const outerBorder = ((has('no-outer-border') || ghost) ? ' border-0' : '')
  const innerBorder = (ghost ? ' border-0' : '')
  const paddingclx = ghost ? ' px-0 py-0' : ' px-6 py-3'
  const mainGap = ghost ? ' gap-2' : ''
  const disabledText = (has('appear-disabled') ? ' text-muted-2' : '')
  const disabledTypoText = (has('appear-disabled') ? ' typography-p:text-muted-2' : '')
  const bgclx = (has('bg-card') ? ' bg-level-1' : '')
  const titleclx = (has('heading-style-title') ? ' font-heading text-base leading-tight' : '') + 
    (ghost ? ' text-left md:text-xl' : '') 
  
  const typoSize: TypographySize = (card.specifiers) ? getTypographySize(card.specifiers) : 'responsive'
  const typoclx = (typoSize === 'sm') ? 'typography-sm typography-p:text-sm ' : (typoSize === 'lg') ? 'typography-lg ' : '' 

  const contentBefore = has('content-before')
  const iconInline = has('icon-inline')
  const contentOnHover = has('reveal-content-on-hover')
  //const smallIconDim = (contentOnHover && card.specifiers) ? getSmallIconDim(card.specifiers) : undefined
  
  const Header: React.FC<{
    inContent?: boolean
    className?: string
  }> = ({
    inContent=false,
    className=''
  }) => (
    (card.title || card.byline || card.icon) ? (
      <CardHeader className={'not-typography' + ' text-accent' + disabledText + paddingclx + innerBorder + className}>
      <div className={(iconInline || inContent) ? 'flex flex-row justify-start items-end my-3' : ''}>        
      {(card.icon && !card.iconAfter ) && (<div className={iconInline ? 'mr-1' : 'mb-2'}>{card.icon}</div>)}
      {card.title && (
        <CardTitle className={'text-center text-lg font-medium' + titleclx + (iconInline ? ' md:text-xl/none' : '') }>
          {card.title}
        </CardTitle>
      )}
      {(card.icon && card.iconAfter) && (<div className={iconInline ? 'ml-1' : 'my-1'}>{card.icon}</div>)}
      </div>
      {card.byline && (<CardDescription>{card.byline}</CardDescription>)}
      </CardHeader>      
    ) : null
  )

  const MediaAndContent: React.FC<{
    className?: string
  }> = ({
    className=''
  }) => (has('media-left') ? ( 
    // media left layout
    <CardContent className={'flex flex-row justify-start items-stretch p-0 grow ' + disabledBorder + bgclx + contentclx + className}>
    {card.media && (
      <div className={'box-content grow-0 not-typography' + paddingclx} style={{
          // If this layout has been specified, assume video, and that the 'sm' variant is there.
        width: (card.media.dim as TShirtDimensions).sm!.w 
      }}>
        <VideoBlockComponent 
          block={card.media} 
          usePoster={has('video-use-poster')} 
          size='sm' 
          className={has('appear-disabled') ? 'opacity-[0.6]' : ''}
        />
      </div>
    )}
    {card.content && (
      <ApplyTypography className={'grow border-l flex flex-col justify-center '  + disabledTypoText + paddingclx + disabledBorder + contentclx} size={typoSize}>
        {(typeof card.content === 'string') ? (<p>{card.content}</p>) : card.content} 
      </ApplyTypography>
    )}
    </CardContent>
  ) : ( // default layout
    <CardContent className={
      'grow typography flex flex-col justify-center ' + 
      typoclx + disabledTypoText + bgclx + paddingclx + contentclx + (has('full-width') ? ' p-0 ' : ' ') +
      className
    }>
      {contentOnHover && (<Header inContent/>)}
      {card.content && contentBefore && (
        (typeof card.content === 'string') ? (<p>{card.content}</p>) : card.content
      )}
      {card.media && (card.media.blockType === 'image' ? (
        <ImageBlockComponent block={card.media} />
      ) : (
        <VideoBlockComponent block={card.media} />
      ))}
      {card.content && !contentBefore && (
        (typeof card.content === 'string') ? (<p>{card.content}</p>) : card.content
      )}
    </CardContent>
  ))

  const Footer: React.FC = () => ( !card.cta ? null : (has('links-w-arrow') ? (
      // links w arrow
    <CardFooter className={
      'typography typography-a:text-muted-2 typography-a:hover:text-muted-1 typography-a:text-xs typography-a:no-underline typography-a:hover:underline ' + 
      'flex flex-col justify-start items-stretch ' + paddingclx
    }>
      <CTABlockComponent 
        block={card.cta} 
        renderLink={(def: LinkDef, key: any) => (<LinkOutButton def={def} key={key} />)}
      />
    </CardFooter>
  ) : ( // default 
    <CardFooter className={'grid grid-cols-1 gap-2 md:flex md:flex-row md:justify-center ' + paddingclx} >
      <CTABlockComponent block={card.cta} />
    </CardFooter>
  )))

  return (
    <Card className={cn(
      'flex flex-col self-stretch ' + 
      (contentOnHover ? 'group relative' : '') + 
      disabledBorder + 
      outerBorder + 
      bgclx + 
      mainGap, 
      className
    )}>
      <Header className={(contentOnHover ? ' absolute top-[0px] left-[0px] w-full hidden ' : '')}/>
      <MediaAndContent className={(contentOnHover ? 
        ' bg-gradient-to-t from-secondary to-65%' + 
        ' items-start justify-start rounded-lg p-4' + 
        ' transition-opacity duration-500 ease-out opacity-100  ' : '')}/>
      <Footer />
    </Card>  
  )
}

export default CardBlockComponent
