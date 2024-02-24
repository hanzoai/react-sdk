'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'
import { useCommerce } from '../service'
import type { CategoryFacetSpec } from '../types'
import { observer } from 'mobx-react-lite'

const SWATCH_SIZE = 16


const CategoryToggle: React.FC<{
  categories: CategoryFacetSpec[]
}> = observer(({
  categories,
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

  const value = categories.filter((cat) => (cat.tc?.isOn)).map((cat) => (cat.id))

  return (
  <ToggleGroup 
    type='multiple' 
    variant='outline'
    value={value}
    rounded='xl' 
    onValueChange={handleValueChange}
  >
      {modelRef.current?.map((spec) => (
        <ToggleGroupItem 
          value={spec.id} 
          disabled={(disabledLast && disabledLast === spec.id) as boolean} 
          aria-label={`Toggle ${spec.label}`}
          key={spec.id}
        >
          <span className='flex h-4 items-center' >
          {spec.img && (
            <Image 
              src={spec.img} 
              alt={`Toggle ${spec.label}`} 
              width={SWATCH_SIZE} 
              height={SWATCH_SIZE} 
              className='block mr-1 aspect-square rounded'
            />
          )}
            {spec.label}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>  
  )
})

const CategoryFacetsWidget: React.FC<{
  facets: CategoryFacetSpec[][]
  className?: string
}> = ({
  facets,
  className=''
}) => {
  return (
    <div className={cn('border p-6 rounded-lg', className)}>
    {facets.map((f) => (
      <CategoryToggle categories={f} key={f[0].id}/>  
    ))}
    </div>
  )
}

export default CategoryFacetsWidget
