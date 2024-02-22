'use client'

import {
  useContext, 
  useRef, 
  type PropsWithChildren,
  createContext
} from 'react'
 
import { type UserRecord } from '../lib/firebase/firebase-admin'
 
const AuthServiceContext = createContext<UserRecord | null>(null) 
 
export const useCurrentUser = (): UserRecord | null =>  (
  useContext(AuthServiceContext) as UserRecord | null
)
 
export const AuthServiceProvider: React.FC<
  PropsWithChildren & { user: UserRecord | null }
> = ({ 
  children,
  user 
}) => {   
   const serviceRef = useRef<UserRecord | null>(user)
   
   return (
     <AuthServiceContext.Provider value={serviceRef.current}>
       {children}
     </AuthServiceContext.Provider>
   )
 }
 