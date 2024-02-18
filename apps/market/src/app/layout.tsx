import React, { type PropsWithChildren } from 'react'

import { default as RootLayoutCommon, viewport } from '@hanzo/ui/next/root-layout'
import '@hanzo/ui/style/globals.css'

import siteDef from '../siteDef'
import metadata from '../metadata'
import { CartProvider } from '@hanzo/cart/context/cart-context'

const RootLayout: React.FC<PropsWithChildren> = ({
  children
}) => (
  <CartProvider>
    <RootLayoutCommon siteDef={siteDef} >
        {children}
    </RootLayoutCommon>
  </CartProvider>
)

export {
  RootLayout as default,
  metadata,
  viewport
}