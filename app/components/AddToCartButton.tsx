"use client"

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'
import { showToast } from './Toast'

type Props = {
  id: string
  name: string
  price: number
  image_url: string
  stock: number
  hasOptions?: boolean
}

const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function AddToCartButton({
  id,
  name,
  price,
  image_url,
  stock,
  hasOptions = false,
}: Props) {
  const { addToCart } = useCart()
  const [devices, setDevices] = useState(1)
  const [years, setYears] = useState(1)

  const unitPrice = hasOptions ? Number(price) * devices * years : Number(price)

  if (stock <= 0) {
    return (
      <button
        disabled
        className="mt-6 bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed font-medium"
      >
        Out of stock
      </button>
    )
  }

  function handleClick() {
    addToCart({
      id,
      name,
      price: unitPrice,
      image_url,
      ...(hasOptions ? { devices, years } : {}),
    })
    showToast('Product added to cart successfully')
  }

  return (
    <div className="mt-6">
      {hasOptions && (
        <div className="mb-4 space-y-3">
          <div className="flex gap-3">
            <label className="flex-1 text-sm text-gray-700">
              Number of devices
              <select
                value={devices}
                onChange={(e) => setDevices(Number(e.target.value))}
                className="mt-1 w-full border rounded px-3 py-2"
              >
                {NUMBERS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'device' : 'devices'}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1 text-sm text-gray-700">
              Number of years
              <select
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-1 w-full border rounded px-3 py-2"
              >
                {NUMBERS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'year' : 'years'}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-lg font-semibold text-[#E27A12]">
            Total: ₦{unitPrice.toLocaleString()}
          </p>
        </div>
      )}

      <button
        onClick={handleClick}
        className="bg-[#E27A12] text-white px-6 py-3 rounded-lg hover:bg-[#c96a0f] transition font-medium"
      >
        Add to Cart
      </button>
    </div>
  )
}