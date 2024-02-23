'use client'
import React from 'react'
import { observer } from 'mobx-react-lite'

import { Icons } from '../../common/Icons'
import type { LineItem } from '../../types'

import { 
  Button, 
} from '@hanzo/ui/primitives'

const QuantifyWidget: React.FC<{ 
  item: LineItem
}> = observer(({
  item
}) => (
  item.isInCart ? (
    <div className='flex flex-row items-stretch bg-secondary rounded-xl'>
      <Button
        aria-label={'Remove a ' + item.product.title + ' from the cart'}
        size='xs'
        variant='secondary'
        rounded='xl'
        className='px-1'
        key='left'
        onClick={item.decrement.bind(item)}
      >
      {(item.quantity > 1) ? (
        <Icons.minus className='h-5 w-5 mr-1' aria-hidden='true'/>
      ) : (
        <Icons.trash className='h-4 w-4 mx-1' aria-hidden='true'/>
      )}
      </Button>
        <div className='text-sm font-bold flex items-center px-2' >{item.quantity}</div>
      <Button
        aria-label={'Add another ' + item.product.title + ' to the cart'}
        size='xs'
        variant='secondary'
        rounded='xl'
        className='px-1'
        onClick={item.increment.bind(item)}
        key='right'
      >
        <Icons.plus className='h-5 w-5 mr-1' aria-hidden='true'/>
      </Button>
    </div>
  ) : (
    <Button
      aria-label={'Add a ' + item.product.title + ' to cart'}
      size='xs'
      variant='secondary'
      rounded='xl'
      className=''
      onClick={item.increment.bind(item)}
    >
      <Icons.plus className='h-5 w-5 mr-1' aria-hidden='true'/>
      <span className='mr-1'>Add</span>
    </Button>
  )
))

export default QuantifyWidget
