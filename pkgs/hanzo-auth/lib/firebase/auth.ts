import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
  signInWithEmailAndPassword
} from 'firebase/auth'

import { auth, firebaseApp } from './firebase'
import type APIResponse from './api-response'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

const isObject = (obj: any): obj is Record<any, any> => typeof obj === 'object' && obj !== null
const isGlobalThisEthereum = (obj: any): obj is { ethereum: { request: <R = any>(payload: Record<any, any>) => Promise<R> } } => isObject(obj) && isObject(obj.ethereum) && typeof obj.ethereum.request === 'function'
const getEthereum = (obj: any) => isGlobalThisEthereum(obj) ? obj.ethereum : null

const ethereum = getEthereum(globalThis)

let signMessage = (opts: { siteName: string, address: string }) => `${opts.siteName} wants you to sign in with your Ethereum account:\n${opts.address}`

const authDb = getFirestore(firebaseApp, 'lux-accounts')  

export type LuxUser = {
  email: string,
  displayName?: string,
  walletAddress?: string
}

export async function signInWithProvider(provider: string): Promise<{success: boolean, user?: LuxUser | null}> {
  const authProvider = (() => {
    switch (provider) {
      case 'google':
        return new GoogleAuthProvider()
      case 'facebook':
        return new FacebookAuthProvider()
      case 'github':
        return new GithubAuthProvider()
      default:
        return null
    }
  })()

  if (!authProvider) {
    return {success: false}
  }

  try {
    const userCreds = await signInWithPopup(auth, authProvider)
    const idToken = await userCreds.user.getIdToken()

    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
    const resBody = (await response.json()) as unknown as APIResponse<string>

    if (response.ok && resBody.success) {
      const walletAddress = await getWalletAddressFromFirestore(userCreds.user.email ?? '')
      return {success: true, user: userCreds.user.email ? {email: userCreds.user.email, displayName: userCreds.user.displayName ?? undefined, walletAddress: walletAddress.result}: null}
    } 
    else {
      return {success: false}
    }
  } 
  catch (error) {
    console.error('Error signing in with Google', error)
    return {success: false}
  }
}

// https://github.com/JonDotsoy/firebase-sign-in-with-ethereum
export async function signInWithEthereum(opts?: { siteName?: string }): Promise<{success: boolean, user?: LuxUser | null}> {
  const {account, signed} = await connectWalletAddress(opts?.siteName)

  let fragment = signed.slice(-10)

  const email = `${account}.${fragment}.3@${auth.app.options.authDomain}`
  const password = signed

  try {
    const res = await signInWithEmailPassword(email, password, account)
    associateWalletAddressWithAccount(email, account)
    return {success: true, user: res.user}
  } catch (e) {
    return {success: false}
  }
}

export async function signInWithEmailPassword(email: string, password: string, ethAccount?: string): Promise<{success: boolean, user?: LuxUser | null}> {
  let user: User | undefined = undefined

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    user = userCredential.user
  } catch (e) {
    const isAuthUserNotFound = (e: any) => typeof e === 'object' && e !== null && e.hasOwnProperty('code') && e.code === 'auth/user-not-found'
    if (isAuthUserNotFound(e)) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user = userCredential.user
    } else {
      throw e
    }
  }

  if (user && !user.displayName) {
    await updateProfile(user, {
      displayName: ethAccount,
    })
  }

  
  try {
    const idToken = await user.getIdToken()

    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
    const resBody = (await response.json()) as unknown as APIResponse<string>

    if (response.ok && resBody.success) {
      const walletAddress = await getWalletAddressFromFirestore(user.email ?? '')
      return {success: true, user: user.email ? {email: user.email, displayName: user.displayName ?? undefined, walletAddress: walletAddress.result}: null}
    } 
    else {
      return {success: false}
    }
  } 
  catch (error) {
    console.error('Error signing in with Google', error)
    return {success: false}
  }
}

export async function signOut(): Promise<{success: boolean}> {
  try {
    await auth.signOut()

    const response = await fetch('/api/auth/sign-out', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resBody = (await response.json()) as unknown as APIResponse<string>
    if (response.ok && resBody.success) {
      return {success: true}
    } 
    else {
      return {success: false}
    }
  } 
  catch (error) {
    console.error('Error signing out with Google', error)
    return {success: false}
  }
}

export async function connectWalletAddress(siteName?: string) {
  if (!ethereum) {
    throw new Error('No ethereum provider found')
  }

  const [account] = await ethereum.request<string[]>({ method: 'eth_requestAccounts' })

  if (!account) {
    throw new Error('No account found')
  }

  const signed = await ethereum.request<string>({
    method: 'personal_sign',
    params: [
      signMessage({
        siteName: siteName ?? auth.app.options.projectId ?? globalThis.location.hostname,
        address: account,
      }),
      account,
      auth.app.options.appId,
    ],
  })

  if (!signed) {
    throw new Error('Not signed')
  }

  return {account, signed}
}
  
export async function associateWalletAddressWithAccount(userEmail: string, siteName?: string) {  
  const {account} = await connectWalletAddress(siteName)

  let result = null
  let error = null
  const accountsRef = collection(authDb, "accounts")

  try {  
    try {
      await setDoc(doc(accountsRef, userEmail), { walletAddress: account })
      result = account
    } catch (e) {  
      console.error(e)
      error = e  
    }  
  } catch (e) {  
    console.error(e)
    error = e  
  }  

  return { result, error }  
}

export async function getWalletAddressFromFirestore(userEmail: string) {  
  let result = null
  let error = null

  try {  
    try {
      result = await getDoc(doc(authDb, "accounts", userEmail))
      result = result.data()?.walletAddress
    } catch (e) {  
      console.error(e)
      error = e  
    }  
  } catch (e) {  
    console.error(e)
    error = e  
  }  

  return { result, error }  
}