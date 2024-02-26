'use client'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'

// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18
import { enableStaticRendering } from 'mobx-react-lite'
enableStaticRendering(typeof window === "undefined")


import type CommerceService from './commerce-service'

import getServiceSingleton from './impl'
import type { Category, Facets } from '../types'

const CommerceServiceContext = createContext<CommerceService | undefined>(undefined)

export const useCommerce = (): CommerceService => {
  return useContext(CommerceServiceContext) as CommerceService
}

export const CommerceServiceProvider: React.FC<PropsWithChildren & {
  categories: Category[]
  facets: Facets
}> = ({ 
  children,
  categories,
  facets,
}) => {

  const serviceRef = useRef<CommerceService>(getServiceSingleton(categories, facets))
  return (
    <CommerceServiceContext.Provider
      value={serviceRef.current}
    >
      {children}
    </CommerceServiceContext.Provider>
  )
}
