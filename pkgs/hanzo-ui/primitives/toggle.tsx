'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../util'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ' + 
  'ring-offset-background ' + 
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' + 
  'focus-visible:ring-offset-2 ' + ' disabled:bg-[#22aa22] ' +
  'active:bg-level-3 active:text-accent ',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-foreground border border-transparent ' + 
          'data-[state=on]:bg-level-2 data-[state=on]:border-muted-1 ' + 
          'hover:bg-level-3 hover:text-accent',
        outline: 'bg-transparent border border-muted-3 text-muted-2 ' +
          'data-[state=off]:bg-[#ccaaaa] hover:data-[state=off]:border-muted-1 hover:data-[state=off]:text-foreground ' + 
          'data-[state=on]:bg-secondary data-[state=on]:border-muted data-[state=on]:text-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
      rounded: {
        full: 'rounded-full',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        none: ''
      }
      
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'md'
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, rounded, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, rounded}), className )}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
