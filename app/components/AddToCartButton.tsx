"use client"

import { useCart } from '@/lib/CartContext'
import { showToast } from './Toast'

type Props = {
  id: string
  name: string
  price: number
  image_url: string
}

export default function AddToCartButton({ id, name, price, image_url }: Props) {
  const { addToCart } = useCart()

  function handleClick() {
    addToCart({ id, name, price, image_url })
    showToast('Product added to cart successfully')
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 bg-[#E27A12] text-white px-6 py-3 rounded-lg hover:bg-[#c96a0f] transition font-medium"
    >
      Add to Cart
    </button>
  )
}