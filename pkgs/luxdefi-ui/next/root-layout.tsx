import React, { type PropsWithChildren } from 'react'

import luxFonts from './lux-fonts'
import Header from '../common/header'
import type { SiteDef } from '../types'

// Next 14: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#use-viewport-export
const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

/*
  These '.variable' fields are actually autogenerate css classnames that *define* the actual
  css variables ('--<ugly-name>') that one asks for in the tailwind classes. 
  They are what make them available in the global scope. So this MUST
  be done like this for the tailwind font classes to work.
  
  (...not to be confused with the css var itself.  This field should be named something else!)
*/

/*
  re overflow-y-hidden overflow-x-hidden ,
  We cannot have these on body tag for scroll-snap to work on iOS!
*/


const bodyClasses = 
  'bg-background text-foreground ' + 
  `${luxFonts.map((el) => (el.variable)).join(' ')}  font-sans` 
    
const RootLayout: React.FC<PropsWithChildren & { siteDef: SiteDef }> = ({ 
  siteDef,
  children,
}) =>  (
  <html lang='en' suppressHydrationWarning className='lux-dark-theme'>
    <head >
      {/* https://stackoverflow.com/a/75716588/11645689 */ }
      <base target='_blank' />
    </head>
    <body className={bodyClasses}>
      <Header siteDef={siteDef}/>
      {children}
    </body>
  </html>
)

export {
  RootLayout as default,
  viewport
}
