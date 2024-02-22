'use client'

import { Button } from '@hanzo/ui/primitives'
import { signInWithGoogle } from '..'

const LoginUi = () => {

  return <div className='flex flex-col gap-2'>
    <h1>Login</h1>
    <Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
  </div>
}

export default LoginUi
