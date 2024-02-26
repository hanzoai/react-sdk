'use client'
import React, { useState, type PropsWithChildren } from 'react'

import { ToggleGroup, ToggleGroupItem,} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'

import type { FacetValue, Facets } from '../../types'
import FacetImage from './facet-image'

export interface FacetMutatorExclusive {
  val: string | null
  set(v: string | null): void
}

export interface FacetMutatorMultiple {
  val: string[] | null
  set(v: string[] | null): void
}

const FacetToggleGroup: React.FC<{
  facetValues: FacetValue[]
  mutator: FacetMutatorExclusive | FacetMutatorMultiple
  exclusive: boolean
  className?: string
  isMobile?: boolean
}> = ({
  facetValues,
  mutator,
  exclusive,
  className='',
  isMobile=false
}) => {

  const [lastRemaining, setLastRemaining] = useState<string | undefined>(undefined)

  const handleValueChangeMultiple = (selected: string[]) => {
    (mutator as FacetMutatorMultiple).set(selected)
    if (selected.length === 1) {
      setLastRemaining(selected[0])
    }
    else {
      setLastRemaining(undefined)   
    }
  }

  const handleValueChangeExclusive = (selected: string) => {
    (mutator as FacetMutatorExclusive).set(selected)
    if (selected) {
      setLastRemaining(selected)
    }
  }

  if (exclusive) {

    return (
      <ToggleGroup 
        type='single' 
        value={mutator.val as string}
        variant='default'
        size={isMobile ? 'sm' : 'default'}
        onValueChange={handleValueChangeExclusive}
        className={className}
      >
      {facetValues.map((fv, index) => {
        let rounded = 'none'  
        if (index === 0) { rounded = 'llg' }
        else if (index === facetValues.length - 1) { rounded = 'rlg' } 
        return (
          <ToggleGroupItem 
            value={fv.token} 
            disabled={(lastRemaining && lastRemaining === fv.token || fv.token === mutator.val) as boolean} 
            aria-label={`Select ${fv.label}`}
              // @ts-ignore
            rounded={rounded}
            key={fv.token}
          >
            <span className={cn('flex flex-row justify-center gap-1 h-4 items-center')} >
              <FacetImage facetValue={fv} />
              <span className='hidden md:block whitespace-nowrap'>{fv.label}</span>
            </span>
          </ToggleGroupItem>
        )
      })}
      </ToggleGroup>  
    )
  }

  return (
    <ToggleGroup 
      type='multiple'
      variant='default'
      value={mutator.val as string[]}
      rounded='xl' 
      size={isMobile ? 'sm' : 'default'}
      onValueChange={handleValueChangeMultiple}
      className={className}
    >
    {facetValues.map((fv) => (
      <ToggleGroupItem 
        value={fv.token} 
        disabled={(lastRemaining && lastRemaining === fv.token) as boolean} 
        aria-label={`Select ${fv.label}`}
          // @ts-ignore
        key={spec.id}
      >
        <span className={cn('flex flex-row justify-center gap-1 h-4 items-center')} >
          <FacetImage facetValue={fv} />
          <span className='hidden md:block whitespace-nowrap'>{fv.label}</span>
        </span>
      </ToggleGroupItem>
    ))}
    </ToggleGroup>  
  )
}

const FacetsWidget: React.FC<PropsWithChildren & {
  facets: Facets
  exclusive: boolean
  facetClassNames?: string[]
  mutators:  FacetMutatorExclusive[] | FacetMutatorMultiple[]
  isMobile?: boolean
  id?: string
  className?: string
}> = ({
  children,
  facets,
  exclusive,
  mutators,
  facetClassNames,
  isMobile=false,
  className='',
  id='FacetsWidget'
}) => {
  const horiz = className.includes('flex-row')
  return (
    <div id={id} className={className} >
    {Object.keys(facets).map((key, i) => (
      <FacetToggleGroup 
        key={i}
        exclusive={exclusive}
        mutator={mutators[i]} 
        isMobile={isMobile}
        facetValues={facets[parseInt(key)]} 
        className={cn((horiz ? '' : 'mb-2'), (i !== 0 && !horiz) ? 'mt-2' : '', (facetClassNames?.[i]) ?? '')} 
      />
    ))}
      {children}
    </div>
  )
}

export default FacetsWidget
