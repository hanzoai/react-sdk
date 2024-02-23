'use client'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'

// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18
import { enableStaticRendering } from 'mobx-react-lite'
enableStaticRendering(typeof window === "undefined")


import type CommerceService from './commerce-service'

import getServiceSingleton from './impl'

const CommerceServiceContext = createContext<CommerceService | undefined>(undefined)

export const useCommerce = (): CommerceService => {
  return useContext(CommerceServiceContext) as CommerceService
}

export const CommerceServiceProvider = ({ children }: PropsWithChildren) => {

  const serviceRef = useRef<CommerceService>(getServiceSingleton())
  return (
    <CommerceServiceContext.Provider
      value={serviceRef.current}
    >
      {children}
    </CommerceServiceContext.Provider>
  )
}
