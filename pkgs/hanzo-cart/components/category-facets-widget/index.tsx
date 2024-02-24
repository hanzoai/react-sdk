'use client'
import React, { useEffect, useState, useRef, type ReactNode } from 'react'

import { ToggleGroup, ToggleGroupItem,} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../../service'
import type { CategoryFacetSpec } from '../../types'
import { observer } from 'mobx-react-lite'

import FacetImage from './facet-image'

const CategoryToggle: React.FC<{
  categories: CategoryFacetSpec[]
  className?: string
}> = observer(({
  categories,
  className=''
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
            <span className='block whitespace-nowrap'>{spec.label}</span>
          </span>
        </ToggleGroupItem>
      )
    })}
    </ToggleGroup>  
  )
})

const CategoryFacetsWidget: React.FC<{
  facets: CategoryFacetSpec[][]
  facetClassNames?: string[]
  className?: string
}> = ({
  facets,
  facetClassNames,
  className=''
}) => {
  return (
    <div className={cn('border p-6 rounded-lg', className)}>
    { /* throws a next / webpack warning about keys.  No idea why */
     facets.map((f, i) => (<>
       {(i !== 0) && (<div className='w-pr-80 bg-muted-2 h-[1px] mx-auto' key={`hr-${i}`}/>)}
      <CategoryToggle 
        key={i} 
        categories={f} 
        className={cn('mb-2', (i !== 0) ? 'mt-2' : '', (facetClassNames?.[i]) ?? '')} 
      />
    </>))}
    </div>
  )
}

export default CategoryFacetsWidget

//       {(i !== 0) && (<hr className='w-pr-80 text-muted-2 mx-auto' key={`hr-${f[0].id}`}/>)}
