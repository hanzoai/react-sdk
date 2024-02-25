'use client'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'

// https://dev.to/ivandotv/mobx-server-side-rendering-with-next-js-4m18
import { enableStaticRendering } from 'mobx-react-lite'
enableStaticRendering(typeof window === "undefined")


import type CommerceService from './commerce-service'

import getServiceSingleton from './impl'
import type { Product, Category } from '../types'

const CommerceServiceContext = createContext<CommerceService | undefined>(undefined)

export const useCommerce = (): CommerceService => {
  return useContext(CommerceServiceContext) as CommerceService
}

export const CommerceServiceProvider: React.FC<PropsWithChildren & {
  products: Product[]
  categories?: Category[]
}> = ({ 
  children,
  products,
  categories
}) => {

  const serviceRef = useRef<CommerceService>(getServiceSingleton(products, categories))
  return (
    <CommerceServiceContext.Provider
      value={serviceRef.current}
    >
      {children}
    </CommerceServiceContext.Provider>
  )
}
