'use client'

import { Button } from '@hanzo/ui/primitives'
import { signInWithGoogle } from '../lib/firebase/auth'
import { useRouter } from 'next/navigation'

const LoginUi: React.FC<{redirectUrl?: string}> = ({redirectUrl}) => {
  const router = useRouter()

  const signIn = async () => {
    const isOk = await signInWithGoogle()
    if (isOk && redirectUrl) router.push(redirectUrl)
  }

  return <div className='flex flex-col gap-6 text-center'>
    <h1>Login</h1>
    <Button onClick={() => signIn()}>Sign in with Google</Button>
  </div>
}

export default LoginUi
