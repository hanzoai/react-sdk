import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from './firebase'

export type APIResponse<T = object> = { success: true; data: T } | { success: false; error: string };

export async function signInWithGoogle(): Promise<boolean> {

  const provider = new GoogleAuthProvider()

  try {
    const userCreds = await signInWithPopup(auth, provider)
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
      return true
    } 
    else {
      return false
    }
  } 
  catch (error) {
    console.error('Error signing in with Google', error)
    return false
  }
}

export async function signOut(): Promise<boolean> {
  try {
    await auth.signOut()

    const response = await fetch('/api/auth/sign-out', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resBody = (await response.json()) as unknown as APIResponse<string>
    if (response.ok && resBody.success) {
      return true
    } 
    else {
      return false
    }
  } 
  catch (error) {
    console.error('Error signing out with Google', error)
    return false
  }
}
