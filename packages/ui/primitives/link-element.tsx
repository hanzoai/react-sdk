import React, { type PropsWithChildren } from 'react'
import Link from 'next/link'

import type { LinkDef, Icon }  from '../types'
import { buttonVariants, type ButtonSizes, type ButtonVariants } from './button'
import { cn } from '../util'

  /**
   * If this is rendered directly (and not auto generated in a Block)
   * and it has any children, title, icon, and iconAfter
   * are ignore.
   */
const LinkElement: React.FC<PropsWithChildren & {
  def: LinkDef,
    /** overrides def */
  variant? : ButtonVariants 
    /** overrides def */
  size?: ButtonSizes  
    /** To trigger other events in addition to the 
     * link action itself. (eg, to also close a drawer menu)  
     */  
  onClick?: () => void  
    /** overrides def (eg, for title area)*/
  icon?: Icon          
    /** overrides def */
  iconAfter?: boolean   
  className?: string,
}> = ({ 
  def,
    // DO NOT provide a default to any of the props that also appear in def!
  size, 
  onClick,
  variant,
  icon,     
  iconAfter, 
  className = '',
  children,
} ) => {

  const {
    href,
    newTab,
    variant: defVariant,
    size: defSize, 
    title
  } = def

  const linkProps: any = {}

      // As per LinkDef docs
  if (href.startsWith('http') || href.startsWith('mailto')) { 
    linkProps.rel = 'noreferrer noopener'
    if (newTab ?? true) {
      linkProps.target = '_blank'
    }
  } 
  else if (newTab) {
    linkProps.target = '_blank'
  }

  const toSpread = {
    href,
    ...(onClick ? { onClick } : {}),
    ...linkProps
  }

  const Contents: React.FC = () => {

    if (React.Children.count(children) > 0) return children

      // Props > def fields > defaults.
    const _icon = (icon) ? icon : (def.icon) ? def.icon : undefined
    const _iconAfter = (iconAfter) ? iconAfter : (def.iconAfter) ? def.iconAfter : false

      // 'title' is not guaranteed as it could be an icon only button / link
    return (<>
      {_icon && !_iconAfter && (<div className='pr-1'>{_icon}</div>)}
      {title && (<div>{title}</div>)}
      {_icon && _iconAfter  && (<div className='pl-1'>{_icon}</div>)}
    </>)
  }

  return (
    <Link
      className={cn(
        buttonVariants({ 
          variant: variant ?  variant : (defVariant ? defVariant : 'link'), 
          size: (!defVariant || defVariant.includes('link') || variant?.includes('link'))  ? 
            'link' 
            : 
            (size ? size : defSize)
        }), 
          // This is a "label only" LinkDef.  cf: footer"
        ((href.length > 0 || onClick) ? '' : 'pointer-events-none'),
        className 
      )}
      {...toSpread}
    >
      <Contents />
    </Link>
  )
}

export default LinkElement
