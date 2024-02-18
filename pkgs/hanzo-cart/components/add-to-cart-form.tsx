'use client'

import React, { useState } from 'react'
import { useCart, type Product } from '../context/cart-context'
import { Button } from '@hanzo/ui/primitives'
import { CartItemActions } from './update-cart'
import Badge from '@hanzo/ui/primitives/badge'

interface AddToCartFormProps {
  product?: Product
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const { addToCart, cartItems } = useCart()
  const [quantity, setQuantity] = useState(0)

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      setQuantity(1)
    }
  }

  const itemInCart = cartItems.find(item => item.product.id === product?.id)
  if (itemInCart) {
    return <Badge><CartItemActions item={itemInCart} /></Badge>
  }
  
  return (
    <Button aria-label='Add to cart' onClick={handleAddToCart}>
      Add to cart
    </Button>
  )
}
