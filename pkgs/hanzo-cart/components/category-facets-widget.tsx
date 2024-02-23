'use client'
import React from 'react'
import Image from 'next/image'

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@hanzo/ui/primitives"
import { cn } from '@hanzo/ui/util'
import { useCommerce } from '../service'

interface CategoryDef {
  id: string
  label: string
  img?: string
}

const SWATCH_SIZE = 16

const CategoryToggle: React.FC<{
  categories: CategoryDef[]
  defaultId: string[]
}> = ({
  categories,
  defaultId
}) => {

  const [disabledLast, setDisabledLast] = React.useState<string | undefined>(undefined)

  const c = useCommerce()
  
  const handleValueChange = (selected: string[]) => {
    c.setSpecifiedCategories(selected)
    console.log("TG: ", selected)
    if (selected.length === 1) {
      setDisabledLast(selected[0])
    }
    else {
      setDisabledLast(undefined)   
    }
  }

  return (
    <ToggleGroup 
      type='multiple' 
      variant='default'
      rounded='xl' 
      defaultValue={defaultId} 
      onValueChange={handleValueChange}
    >
      {categories.map((cd) => (
        <ToggleGroupItem 
          value={cd.id} 
          disabled={(disabledLast && disabledLast === cd.id) as boolean} 
          aria-label={`Toggle ${cd.label}`}
        >
          <span className='flex h-4 items-center' >
            <Image 
              src={cd.img!} 
              alt={`Toggle ${cd.label}`} 
              width={SWATCH_SIZE} 
              height={SWATCH_SIZE} 
              className='block mr-1 aspect-square rounded'
            />
            {cd.label}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>  
  )
}

const CATS = [
  {
    id: 'AG',
    label: 'Silver',
    img: '/assets/img/cart/ui/silver-swatch-200x200.png'
  },
  {
    id: 'AU',
    label: 'Gold',
    img: '/assets/img/cart/ui/gold-swatch-150x150.png'
  },
]

const CategoryFacetsWidget: React.FC<{
  className?: string
}> = ({
  className=''
}) => {
  return (
    <div className={cn('border p-6 rounded-lg', className)}>
      <CategoryToggle categories={CATS} defaultId={['AG','AU']}/>
    </div>
  )
}

export default CategoryFacetsWidget
