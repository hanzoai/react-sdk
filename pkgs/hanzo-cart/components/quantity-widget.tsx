'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@hanzo/ui/primitives'
import { cn } from '@hanzo/ui/util'

import { Icons } from './Icons'
import type { LineItem } from '../types'

const QuantityWidget: React.FC<{ 
  item: LineItem
  ghost?: boolean
  className?: string
}> = observer(({
  item,
  ghost=false,
  className=''
}) => {

  const iconClx = ghost ? 'h-3 w-3 text-muted-2 hover:text-foreground' : 'h-5 w-5 mr-1'
  const digitClx = ghost ? 'px-1' : 'px-2 font-bold '
  
  return ( item.isInCart ? (
    <div className={cn('flex flex-row items-stretch ' + (ghost ? 'bg-transparent  rounded-xl' : 'bg-secondary rounded-xl'), className)}>
      <Button
        aria-label={'Remove a ' + item.product.title + ' from the cart'}
        size='xs'
        variant={ghost ? 'ghost' : 'secondary'}
        rounded={ghost ? 'full' : 'xl'}
        className='px-1'
        key='left'
        onClick={item.decrement.bind(item)}
      >
      {(item.quantity > 1) ? (
        <Icons.minus className={iconClx} aria-hidden='true'/>
      ) : (
        <Icons.trash className={iconClx} aria-hidden='true'/>
      )}
      </Button>
        <div className={'text-sm flex items-center cursor-default ' + digitClx} >{item.quantity}</div>
      <Button
        aria-label={'Add another ' + item.product.title + ' to the cart'}
        size='xs'
        variant={ghost ? 'ghost' : 'secondary'}
        rounded={ghost ? 'full' : 'xl'}
        className='px-1'
        onClick={item.increment.bind(item)}
        key='right'
      >
        <Icons.plus className={iconClx} aria-hidden='true'/>
      </Button>
    </div>
  ) : (
    <Button
      aria-label={'Add a ' + item.product.title + ' to cart'}
      size='xs'
      variant='secondary'
      rounded='xl'
      className={className}
      onClick={item.increment.bind(item)}
    >
      <Icons.plus className='h-5 w-5 mr-1' aria-hidden='true'/>
      <span className='mr-1'>Add</span>
    </Button>
  ))
})

export default QuantityWidget
