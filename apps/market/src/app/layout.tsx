import React, { type PropsWithChildren } from 'react'

import { default as RootLayoutCommon, viewport as _viewport } from '@hanzo/ui/next/root-layout'
import '@hanzo/ui/style/globals.css'

import siteDef from '../siteDef'
import _metadata from '../metadata'
import { CommerceServiceProvider } from '@hanzo/cart/service'
import { AuthServiceProvider } from '@hanzo/auth'
import { getCurrentUserServerSide } from '@hanzo/auth/server'
import { Toaster } from '@hanzo/ui/primitives'

export const metadata = {
  ..._metadata
}

export const viewport = {
  ..._viewport
}

const RootLayout: React.FC<PropsWithChildren> = async ({
  children
}) => {
  const currentUser = await getCurrentUserServerSide()

  return (
    <AuthServiceProvider user={currentUser?.email ? {email: currentUser?.email} : null}>
      <CommerceServiceProvider>
        <RootLayoutCommon siteDef={siteDef} >
            {children}
            <Toaster />
        </RootLayoutCommon>
      </CommerceServiceProvider>
    </AuthServiceProvider>
  )
  }
export default RootLayout