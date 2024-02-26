import React, { type PropsWithChildren } from 'react'

import { default as RootLayoutCommon, viewport as _viewport } from '@hanzo/ui/next/root-layout'
import '@hanzo/ui/style/globals.css'

import siteDef from '../siteDef'
import _metadata from '../metadata'
import { CommerceServiceProvider } from '@hanzo/cart/service'

export const metadata = {
  ..._metadata
}

export const viewport = {
  ..._viewport
}

const RootLayout: React.FC<PropsWithChildren> = ({
  children
}) => (
  <CommerceServiceProvider 
    facets={siteDef.ext.commerce.facets} 
    categories={siteDef.ext.commerce.categories}
  >
    <RootLayoutCommon siteDef={siteDef} >
        {children}
    </RootLayoutCommon>
  </CommerceServiceProvider>
)

export default RootLayout