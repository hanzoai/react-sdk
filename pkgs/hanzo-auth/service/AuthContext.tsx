'use client'

import React, {
  useContext,
  useState,
  type PropsWithChildren
} from 'react'
import type { LuxUser } from '../lib/firebase/auth'

export type AuthService = {
  user: LuxUser | null,
  setUser: React.Dispatch<React.SetStateAction<LuxUser | null>>
}

const AuthServiceContext = React.createContext<AuthService | undefined>(undefined)

export const useCurrentUser = (): AuthService => {
  const context = useContext(AuthServiceContext)
  if (!context) {
    throw new Error('useCurrentUser must be used within an AuthServiceProvider')
  }
  return context
}

export const AuthServiceProvider: React.FC<
  PropsWithChildren & { user: LuxUser | null }
> = ({
  children,
  user
}) => {
  const [currentUser, setCurrentUser] = useState<LuxUser | null>(user)

  return (
    <AuthServiceContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
      {children}
    </AuthServiceContext.Provider>
  )
}