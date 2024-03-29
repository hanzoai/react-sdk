'use client'
import { useState, type PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import { observer } from 'mobx-react-lite'

import { ArrowLeft } from 'lucide-react'

import { ApplyTypography, Button, Separator, toast } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { useAuth } from '../service'
import { Facebook, Google, GitHub } from '../icons'
import EmailPasswordForm from './email-password-form'
import { sendGAEvent } from '../util/analytics'

const Login: React.FC<PropsWithChildren & {
  redirectUrl?: string,
  getStartedUrl?: string,
  returnToUrl?: string,
  className?: string,
  inputClassName?: string,
  noHeading?: boolean
  onLoginChanged?: (loggedIn: boolean) => void
}> = observer(({
  children,
  redirectUrl,
  getStartedUrl,
  returnToUrl,
  className,
  inputClassName,
  noHeading,
  onLoginChanged
}) => {
  const router = useRouter()
  
  const auth = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const succeed = (loggedOut = false) => {
      // If a callback is provide, don't redirect.
      // Assume host code is handling (eg, mobile menu)
    if (onLoginChanged) {
      onLoginChanged(!loggedOut)
    }
    else if (redirectUrl) {
      router.push(redirectUrl)
    }
  }

  const loginWithEmailPassword = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await auth.loginEmailAndPassword(email, password)
      if (res.success) {
        sendGAEvent('login', {
          method: 'email'
        })
        succeed()
      }
    } 
    catch (e) {
      toast("User with this email already signed up using a different provider")
    }
    setIsLoading(false)
  }

  // const loginWithEthereum = async () => {
  //   setIsLoading(true)
  //   try {
  //     const res = await signInWithEthereum()
  //     if (res.success && res.user) {
  //       setUser({email: res.user?.email, displayName: res.user?.displayName, walletAddress: res.user?.walletAddress})
  //       if (redirectUrl) {
  //         router.push(redirectUrl)
  //       }
  //     }
  //   } catch (e) {
  //     toast({title: "No Ethereum provider found"})
  //   }
  //   setIsLoading(false)
  // }

  const loginWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(true)
    const res = await auth.loginWithProvider(provider)
    if (res.success ) {
      sendGAEvent('login', {
        method: provider
      })
      succeed()
    }
    setIsLoading(false)
  }

  const logout = async () => {
    setIsLoading(true)
    const res = await auth.logout()
    if (res.success) {
      succeed(false)
    }
    setIsLoading(false)
  }

  return (
    <ApplyTypography className={cn('w-full flex flex-col text-center !gap-3 LOGIN_OUTER', className)}>
      {auth.loggedIn && !redirectUrl ? (
        <>
          <h3>Welcome!</h3>
          {auth.user && (<> {/*  this means the hanzo user isn't loaded yet ...*/}
            <p>You are signed in as {auth.user?.displayName ?? auth.user?.email}</p>
            <div className='flex flex-col gap-4 items-center justify-center'>
              {getStartedUrl && <Button variant='primary' onClick={() => router.push(getStartedUrl)}>GET STARTED</Button>}
              <Button onClick={() => logout()} variant='outline' disabled={isLoading}>Sign Out</Button>
            </div>
          </>)}
        </>
      ) : (
        <>
          {!noHeading && (
            <div className='mb-4 items-center flex'>
              {returnToUrl && (
                <Button size='icon' variant='ghost' className='absolute' onClick={() => router.push(returnToUrl)}>
                  <ArrowLeft/>
                </Button>
              )}
              <h3 className='mx-auto'>Login</h3>
            </div>
          )}
          {redirectUrl === 'checkout' && <p>You will be redirected to checkout after login.</p>}
          {children}
          <EmailPasswordForm onSubmit={loginWithEmailPassword} isLoading={isLoading} className='mb-4' inputClassName={inputClassName}/>
          <div className='flex gap-2 whitespace-nowrap items-center my-1 sm:my-3 text-xs text-muted'>
            <Separator className='grow w-auto'/><div className='shrink-0 mx-1'>or continue with</div><Separator className='grow w-auto'/>
          </div>

          {/* <Button onClick={loginWithEthereum} className='w-full mx-auto flex items-center gap-2' disabled={isLoading}>
            <Ethereum height={20}/>Login with your wallet
          </Button> */}
          <Button onClick={() => loginWithProvider('google')} className='w-full mx-auto flex items-center gap-2' disabled={isLoading}>
            <Google height={20}/>Google
          </Button>
          <Button onClick={() => loginWithProvider('facebook')} className='w-full mx-auto flex items-center gap-2' disabled={isLoading}>
            <Facebook height={20}/>Facebook
          </Button>
          <Button onClick={() => loginWithProvider('github')} className='w-full mx-auto flex items-center gap-2' disabled={isLoading}>
            <GitHub height={20}/>Github
          </Button>
        </>
      )}
    </ApplyTypography>
  )
})

export default Login