'use client'
import React, {type PropsWithChildren } from 'react'

import { X as LucideX} from 'lucide-react'

import { Button, Drawer, DrawerContent } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

const CommerceDrawer: React.FC<PropsWithChildren & {
  open: boolean
  setOpen: (b: boolean) => void
  drawerClx?: string
}> = ({
  children,
  open,
  setOpen,
  drawerClx='',
}) => (
  <Drawer open={open} onOpenChange={setOpen} >
    <DrawerContent className={cn(
      'rounded-t-xl mt-6 pb-12 h-auto min-h-[35vh] pt-6', 
      'md:max-w-[550px] md:mx-auto lg:max-w-[50vw]', 
      drawerClx
    )}>
      {children}
      <Button
        variant='ghost'
        size='icon'
        onClick={() => {setOpen(false)}}
        className={'absolute top-4 right-4 w-8 h-8 group rounded-full p-1 hidden md:flex items-center'}
      >
        <LucideX className='w-6 h-6 text-muted group-hover:text-foreground'/>
      </Button>    
    </DrawerContent>
  </Drawer>
)


export default CommerceDrawer

