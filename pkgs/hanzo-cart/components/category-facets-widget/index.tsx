'use client'
import React, { useEffect, useState, useRef, type ReactNode, type PropsWithChildren } from 'react'

import { ToggleGroup, ToggleGroupItem,} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../../service'
import type { CategoryFacetSpec } from '../../types'
import { observer } from 'mobx-react-lite'

import FacetImage from './facet-image'

const CategoryToggle: React.FC<{
  categories: CategoryFacetSpec[]
  className?: string
  isMobile?: boolean
}> = observer(({
  categories,
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
  
  const handleValueChange = (selected: string[]) => {
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

    // string[] of "on" values
  const groupValue = categories.filter((cat) => (cat.tc?.isOn)).map((cat) => (cat.id))

  return (
    <ToggleGroup 
      type='multiple' 
      variant='default'
      value={groupValue}
      rounded='xl' 
      size={isMobile ? 'sm' : 'default'}
      onValueChange={handleValueChange}
      className={className}
    >
    {modelRef.current?.map((spec) => {
      return (
        <ToggleGroupItem 
          value={spec.id} 
          disabled={(disabledLast && disabledLast === spec.id) as boolean} 
          aria-label={`Toggle ${spec.label}`}
          key={spec.id}
        >
          <span className={cn('flex flex-row justify-center gap-1 h-4 items-center')} >
            <FacetImage spec={spec} />
            <span className='hidden lg:block whitespace-nowrap'>{spec.label}</span>
          </span>
        </ToggleGroupItem>
      )
    })}
    </ToggleGroup>  
  )
})

const CategoryFacetsWidget: React.FC<PropsWithChildren & {
  facets: CategoryFacetSpec[][]
  facetClassNames?: string[]
  isMobile?: boolean
  className?: string
}> = ({
  children,
  facets,
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
