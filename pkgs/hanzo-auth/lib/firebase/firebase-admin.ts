import 'server-only'

import { cookies } from 'next/headers'

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { type SessionCookieOptions, type UserRecord, getAuth } from 'firebase-admin/auth'

export const firebaseApp =
  getApps().find((it) => it.name === 'firebase-admin-app') ||
  initializeApp(
    {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY 
          ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    },
    'firebase-admin-app'
  )
export const auth = getAuth(firebaseApp)

export async function isUserAuthenticated(session: string | undefined = undefined) {
  const _session = session ?? (await getSession())
  if (!_session) return false

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true))
    return !isRevoked
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  const session = await getSession()

  if (!(await isUserAuthenticated(session))) {
    return null
  }

  const decodedIdToken = await auth.verifySessionCookie(session!)
  const currentUser = await auth.getUser(decodedIdToken.uid)

  return currentUser
}

async function getSession() {
  try {
    return cookies().get('__session')?.value
  } 
  catch (error) {
    return undefined
  }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
  return auth.createSessionCookie(idToken, sessionCookieOptions)
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session)

  return await auth.revokeRefreshTokens(decodedIdToken.sub)
}

export {
  type UserRecord
}