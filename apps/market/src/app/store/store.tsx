'use client'
import React from 'react'

import { ProductCard } from '@hanzo/cart/components'
import { useCommerce } from '@hanzo/cart/service'


const Store: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
  className?: string
}> = ({
  className='',
  searchParams={ ignore: undefined }
}) => {
  const c = useCommerce()
  return (<div className='grid grid-cols-2'>
    {c.specifiedProducts.map((prod) => (
      <ProductCard product={prod} />
    ))}
  </div>)

} 

export default Store
