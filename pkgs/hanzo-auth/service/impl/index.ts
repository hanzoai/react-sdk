import { observable, computed, action, runInAction } from 'mobx'

import type AuthService from '../auth-service'
import type { AuthServiceConf, HanzoUserInfo, HanzoUserInfoValue } from '../../types'

import { 
  auth as fbAuth, 
  loginWithEmailAndPassword,
  loginWithProvider,
  logoutBackend 
} from './firebase-support'
import { associateWalletAddressWithAccount, getAssociatedWalletAddress } from './wallet-support'

class HanzoUserInfoStore implements HanzoUserInfo {

  @observable _email: string = ''
  @observable _displayName: string | null = null 
  @observable _walletAddress: string | null = null

  @computed get email(): string { return this._email}
  @computed get displayName(): string | null { return this._displayName}
  @computed get walletAddress(): string | null { return this._walletAddress}

  @action clear() {
    this._email = ''
    this._displayName = null
    this._walletAddress = null
  }

  @action set(v: HanzoUserInfoValue) {
    this._email = v.email
    this._displayName = v.displayName
    this._walletAddress = v.walletAddress
  }

  @computed get isValid(): boolean {
    return (this._email.length > 0)  
  }
}



class AuthServiceImpl implements AuthService {

  private _hzUser = new HanzoUserInfoStore()

  constructor(conf: AuthServiceConf, user: HanzoUserInfoValue | null) {
      // ignore conf for now
    if (user) {
      this._hzUser.set(user)
    }
  }

  get user(): HanzoUserInfo | null {
    return this._hzUser.isValid ? this._hzUser : null
  }

  loggedIn = (): boolean => (
    !!fbAuth.currentUser
  )

  loginEmailAndPassword = async (
    email: string, 
    password: string
   ):  Promise<{success: boolean, userInfo: HanzoUserInfo | null}> => {

    try {
      this._hzUser.clear()
      const res = await loginWithEmailAndPassword(email, password)
      if (res.success && res.user) {
        const walletAddress = res.user.email ? await getAssociatedWalletAddress(res.user.email) : undefined
        this._hzUser.set({
          email: res.user.email ?? '',
          displayName : res.user.displayName ?? null,
          walletAddress : walletAddress?.result ?? null
        })

        return {
          success: true,
          userInfo: this._hzUser
        }
      }
      return {
        success: false,
        userInfo: null
      }
    }
    catch (e) {
      console.error('Error signing in with Firebase auth', e)
      return {success: false, userInfo: null}
    }
  }

  loginWithProvider = async (
    provider: 'google' | 'facebook' | 'github'
   ):  Promise<{success: boolean, userInfo: HanzoUserInfo | null}> => {

    try {
      this._hzUser.clear()
      const res = await loginWithProvider(provider)
      if (res.success && res.user) {
        const walletAddress = res.user.email ? await getAssociatedWalletAddress(res.user.email) : undefined
        this._hzUser.set({
          email: res.user.email ?? '',
          displayName : res.user.displayName ?? null,
          walletAddress : walletAddress?.result ?? null
        })

        return {
          success: true,
          userInfo: this._hzUser
        }
      }
      return {
        success: false,
        userInfo: null
      }
    }
    catch (e) {
      console.error('Error signing in with Firebase auth', e)
      return {success: false, userInfo: null}
    }
  }

  associateWallet = async (): Promise<void>  => {
    if (this._hzUser.isValid) {
      const res = await associateWalletAddressWithAccount(this._hzUser.email)
      if (!res.error) {
        //runInAction(() => {
          this._hzUser._walletAddress = res.result ?? null
        //})
      }
    }
  }

  logout = async (): Promise<{ success: boolean }> => {

    await fbAuth.signOut()
    this._hzUser.clear()
    return await logoutBackend()
  }

  setServerSideUser = (user: HanzoUserInfoValue | null)  => {
    if (user) {
      this._hzUser.set(user)
    }
  }
}

export default AuthServiceImpl