'use client'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'
import type CommerceService from './service'

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
