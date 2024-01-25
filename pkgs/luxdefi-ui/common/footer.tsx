import React from 'react'

import type { ButtonVariants } from '../primitives'
import type { LinkDef, SiteDef } from '../types'
import { Copyright, NavItems } from '../common'

import Logo from './logo'

const Footer: React.FC<{
  siteDef: SiteDef,
  className?: string,
  noHorizPadding?: boolean
}> = ({
  siteDef,
  className='',
  noHorizPadding=false
}) => (
  <footer className={className}> 
    <div className={
      (noHorizPadding ? '' : 'lg:px-8 px-5 md:px-[32px] ') +
      'grid grid-cols-2 gap-x-16 gap-y-6 ' +
      'sm:grid-cols-3 ' + 
      'md:w-full md:mx-0 ' +
      'lg:flex lg:flex-row lg:justify-between lg:gap-8 lg:w-full' + 
      'max-w-screen-2xl ' + 
      `lg:columns-${siteDef.footer.length + 1}` // must safelist these! see tailwind docs
    }>
      <div className='hidden lg:flex flex-col' key={0}>
        <Logo size='md' />
      </div>
      {siteDef.footer.map((defs: LinkDef[], index, arr) => {
        const colSpan = ((index === arr.length - 1) && (arr.length % 2 === 1)) ? 'col-span-2 mx-auto items-center sm:col-span-1 sm:mx-0 sm:items-start' : ''
        return (
          <NavItems
            items={defs} 
            currentAs={siteDef.currentAs}
            as='nav' 
            className={'w-fit flex flex-col justify-start items-start gap-[11px] sm:gap-[12px] md:gap-[15px] ' + colSpan} 
            key={index + 1}
            itemClassName={'text-[15px]/[1.1] font-normal tracking-[0.2px] text-muted-1'}
            itemClassNameFromVariant={
              (variant: ButtonVariants) => ( 
                variant === 'linkFG' ? 'font-heading text-[15px]/[1.3] font-medium text-foreground tracking-normal' : ''
              )
            }
          /> 
        )
      })}
    </div>
    <div className='text-sm text-center text-muted-3'>
      <Copyright />
    </div>
  </footer>
)

export default Footer
