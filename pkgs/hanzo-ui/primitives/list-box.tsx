'use client'
import React from 'react'
import { cn } from '../util'

function Item<T>({
  value,
  label,
  className,
  onClick,
  first=false,
  last=false,
  selected=false
}:{
  value: T
  label: string
  className: string
  onClick: (val: T) => void
  first?: boolean
  last?: boolean
  selected?: boolean
}) {

  return (
    <div 
      className={cn(
        'font-normal text-muted', 
        last ? '' : 'border-b', 
        selected ? 'font-semibold text-foreground' : '', 
        className
      )} 
      onClick={() => {onClick(value)}}
    >
      <span>{label}</span>
    </div>
  )
}

function ListBox<T>({
  values,
  labels,
  onValueChange,
  value,
  isEqual,
  outClx = '',
  itemClx = '' 
}:{
  values: T[]
  labels: string[]
  onValueChange: (val: T) => void
  value: T | undefined
  isEqual: (v1: T, v2: T) => boolean
  outClx?: string
  itemClx?: string 
}): JSX.Element {

  return (
    <div className={cn('border rounded-md', outClx)} >
    {values.map((val, i) => (
      <Item<T> 
        value={val} 
        label={labels[i]} 
        onClick={onValueChange} 
        className={itemClx}
        first={i === 0}
        last={i === 0}
        selected={value && isEqual(val, value)}
        key={labels[i]}
      />
    ))}
    </div>
  )
}

export default ListBox
