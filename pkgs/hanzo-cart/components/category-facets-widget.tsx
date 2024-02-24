'use client'
import React, { useEffect, useState, useRef, type ReactNode } from 'react'
import Image from 'next/image'

import { ToggleGroup, ToggleGroupItem,} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'

import { useCommerce } from '../service'
import type { CategoryFacetSpec } from '../types'
import { observer } from 'mobx-react-lite'

const ICON_SIZE = 16
const SVG_MULT = 1.5

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

  const FacetImage: React.FC<{
    spec: CategoryFacetSpec
  }> = ({
    spec
  }) => {
    if (!spec.img) {
      return null
    }
    const isURL = typeof spec.img === 'string'
    if (isURL) {
      return (
        <Image 
          src={spec.img as string} 
          alt={`Toggle ${spec.label}`} 
          className={'block mr-1 aspect-square rounded border border-muted-2'}
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      )
    }
    const svgStyle: any = { position: 'relative' }
    if (spec.ar && spec.ar < 1) {
      const w = ICON_SIZE * SVG_MULT
      svgStyle.top = (( 1 / spec.ar - 1) * w) / 2
    }
    else if (spec.ar && spec.ar > 1) {
      const h = ICON_SIZE * SVG_MULT
      svgStyle.left = (((1 - spec.ar) * h) / 2)
    }

    return (
      <span 
        className='block overflow-hidden text-foreground ' 
        style={{
          width: ICON_SIZE * SVG_MULT, 
          height: ICON_SIZE * SVG_MULT,
        }} 
      >
        {React.cloneElement(spec.img as React.ReactElement<any>, {
          width: (spec.ar ?? 1) * ICON_SIZE * SVG_MULT, 
          height: SVG_MULT * ICON_SIZE,
          style: svgStyle
        })}
      </span>
    )
  } 

    // string[] of "on" values
  const groupValue = categories.filter((cat) => (cat.tc?.isOn)).map((cat) => (cat.id))

  return (
    <ToggleGroup 
      type='multiple' 
      variant='outline'
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
    {facets.map((f, i) => (<>
      {(i !== 0) && (<hr className='w-pr-80 text-muted-2 mx-auto'/>)}
      <CategoryToggle 
        categories={f} 
        key={f[0].id} 
        className={cn('mb-2', (i !== 0) ? 'mt-2' : '', (facetClassNames?.[i]) ?? '')} 
      />  
    </>))}
    </div>
  )
}

export default CategoryFacetsWidget
