'use client'

import { Button, LinkElement, Popover, PopoverContent, PopoverTrigger, Separator } from '@hanzo/ui/primitives'

import { useCurrentUser } from '../service/AuthContext'
import { signOut } from '../lib/firebase/auth'
import type { LinkDef } from '@hanzo/ui/types'
import { cn } from '@hanzo/ui/util'

const AuthWidget: React.FC<{className?: string}> = ({className}) => {
  const {user, setUser} = useCurrentUser()

  const logout = async () => {
    const res = await signOut()
    if (res.success) {
      setUser(null)
    }
  }

  if (!user) {
    return (
      <LinkElement
        def={{href: '/login', title: 'Login', variant: 'primary'} as LinkDef}
        className='font-heading h-8 tracking-[-0.3px] !text-[13px]/[13px] w-fit !min-w-0'
      />
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size='icon' className={cn('rounded-full text-foreground uppercase w-9 h-9', className)}>{user?.email[0]}</Button>
      </PopoverTrigger>
      <PopoverContent className='bg-level-0'>
        <div className="grid gap-4">
          <div className="space-y-2 truncate">
            {user?.displayName ? (
              <>
                <h4 className="font-medium leading-none truncate">{user?.displayName}</h4>
                <p className="text-sm opacity-50 truncate">{user?.email}</p>
              </>
            ) : (
              <h4 className="font-medium leading-none truncate">{user?.email}</h4>
            )}
          </div>
          <Separator />
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AuthWidget