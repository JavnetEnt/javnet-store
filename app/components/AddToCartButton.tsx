"use client"

import { useCart } from '@/lib/CartContext'

type Props = {
  id: string
  name: string
  price: number
  image_url: string
}

export default function AddToCartButton({ id, name, price, image_url }: Props) {
  const { addToCart } = useCart()

  return (
    <button
      onClick={() => addToCart({ id, name, price, image_url })}
      className="mt-6 bg-[#E27A12] text-white px-6 py-3 rounded-lg hover:bg-[#c96a0f] transition font-medium"
    >
      Add to Cart
    </button>
  )
}