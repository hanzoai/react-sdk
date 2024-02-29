'use client'
import React from 'react'

import { LinkElement }  from '@hanzo/ui/primitives'
import type { LinkDef, SiteDef } from '@hanzo/ui/types'
import { cn } from '@hanzo/ui/util'

const MobileNav: React.FC<{
  siteDef: SiteDef
  className?: string
  commonItemClx?: string | ((def: LinkDef) => string),
  /**
   * This is called *in addition* to the link's actual navigation 
   * action.  eg, I link is clicked, and the modal menu is closes
   */
  onAction?: () => void 
}> = ({
  siteDef,
  onAction,
  className='',
  commonItemClx,
}) => {

  const { nav: { common, featured }} = siteDef

  return (common.length || featured?.length) ? (
    <nav className={className} >
    {common.map((el, index) => {
      const variant = el.variant ?? 'link'
      let internalClx = '' 
        // note that linkFG (or any other variant of 'link') 
        // will not get assigned these classes,
        // and will remain styles is 'foreground' (hence the name)
      if (variant === 'link') {
        internalClx+= ' text-nav hover:text-nav-hover active:text-nav-hover '
        if (siteDef.currentAs && siteDef.currentAs === el.href) {
          internalClx += ' text-nav-current'
        }
      } 
      else {
        internalClx+= ' min-w-0'   
      }
      if (siteDef.currentAs && siteDef.currentAs === el.href) {
        internalClx += ' pointer-events-none'
      }
      const itemClx = (commonItemClx) ? (typeof commonItemClx === 'string' ? commonItemClx : commonItemClx(el)) : '' 

      return (
        <LinkElement 
          def={el}
          key={`common-${index}`}
          size='lg'
          className={cn(internalClx, itemClx)}
          onClick = {onAction}  
        />
      )
    })}
    {featured?.length && (featured.map((el, index) => (
      <LinkElement 
        def={el}
        key={`featured-${index}`}
        size='lg'
        className='mt-6 w-4/5 mx-auto'
        onClick={onAction}  
      />
    )))}
    </nav>
  ) 
  : null
}

export default MobileNav
