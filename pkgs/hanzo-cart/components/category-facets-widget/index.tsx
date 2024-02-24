'use client'
import React, { useEffect, useState, useRef, type ReactNode, type PropsWithChildren } from 'react'

import { ToggleGroup, ToggleGroupItem, toggleVariants,} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../../service'
import type { CategoryFacetSpec } from '../../types'
import { observer } from 'mobx-react-lite'

import FacetImage from './facet-image'

export interface CategoryGetterSetter {
  val: string | null
  set(v: string | null): void
}

const CategoryToggle: React.FC<{
  categories: CategoryFacetSpec[]
  mutator?: CategoryGetterSetter
  className?: string
  isMobile?: boolean
}> = observer(({
  categories,
  mutator,
  className='',
  isMobile=false
}) => {

  const [disabledLast, setDisabledLast] = useState<string | undefined>(undefined)
  const modelRef = useRef<CategoryFacetSpec[] | undefined>(undefined) 
  const c = useCommerce()

  useEffect(() => {
    const ids = categories.map((c) => (c.id))
    const tcs = c.getCategories(ids)
    categories.forEach((specCat, i) => {
      specCat.tc = tcs.find((storeCat) => (storeCat.id === specCat.id))
    })
    modelRef.current = categories
  }, [])
  
  const handleValueChangeMultiple = (selected: string[]) => {
    const states: {[key: string]: boolean} = {}
    categories.forEach((c) => {
      states[c.id] = selected.includes(c.id)
    })
    c.setCategoryStates(states)
    if (selected.length === 1) {
      setDisabledLast(selected[0])
    }
    else {
      setDisabledLast(undefined)   
    }
  }

  const handleValueChangeSingle = (selected: string) => {
    mutator!.set(selected)
    if (selected) {
      setDisabledLast(selected)
    }
  }

  const Items: React.FC<{single: boolean}> = ({
    single
  }) => (
    modelRef.current?.map((spec, index, arr) => {
      let variant: string | undefined = undefined
      if (single && index === 0) {
        variant = 'singleFirst'
      }
      else if (single && index === arr.length - 1) {
        variant = 'singleLast'
      } else if (single && index > 0 && index < arr.length - 1) {
        variant = 'singleMiddle'
      }
      return (
        <ToggleGroupItem 
          value={spec.id} 
          disabled={(disabledLast && disabledLast === spec.id) as boolean} 
          aria-label={`Select ${spec.label}`}
            // @ts-ignore
          variant={variant}
          key={spec.id}
        >
          <span className={cn('flex flex-row justify-center gap-1 h-4 items-center')} >
            <FacetImage spec={spec} />
            <span className='hidden lg:block whitespace-nowrap'>{spec.label}</span>
          </span>
        </ToggleGroupItem>
      )
    })
  )


  if (mutator) {
    return (
      <ToggleGroup 
        type='single' 
        value={mutator.val as string}
        size={isMobile ? 'sm' : 'default'}
        onValueChange={handleValueChangeSingle}
        className={className}
      >
        <Items single={true} />
      </ToggleGroup>  
    )
  }

    // string[] of "on" values
  const groupValue = categories.filter((cat) => (cat.tc?.isOn)).map((cat) => (cat.id))

  return (
    <ToggleGroup 
      type='multiple'
      variant='default'
      value={groupValue}
      rounded='xl' 
      size={isMobile ? 'sm' : 'default'}
      onValueChange={handleValueChangeMultiple}
      className={className}
    >
      <Items single={false} />
    </ToggleGroup>  
  )
})

const CategoryFacetsWidget: React.FC<PropsWithChildren & {
  facets: CategoryFacetSpec[][]
  facetClassNames?: string[]
  mutators?: CategoryGetterSetter[]
  isMobile?: boolean
  className?: string
}> = ({
  children,
  facets,
  mutators,
  facetClassNames,
  isMobile=false,
  className='',
}) => {
  const horiz = className.includes('flex-row')
  return (
    <div className={className}>
        {facets.map((f, i) => (
          <CategoryToggle 
            key={i}
            mutator={mutators ? mutators![i] : undefined} 
            isMobile={isMobile}
            categories={f} 
            className={cn((horiz ? '' : 'mb-2'), (i !== 0 && !horiz) ? 'mt-2' : '', (facetClassNames?.[i]) ?? '')} 
          />
        ))}
    {children}
    </div>
  )
}

export default CategoryFacetsWidget
