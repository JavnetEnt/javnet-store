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
  prices?: Record<string, number> | null
}

const DEVICE_OPTIONS = Array.from({ length: 25 }, (_, i) => i + 1)
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => i + 1)

export default function AddToCartButton({
  id,
  name,
  price,
  image_url,
  stock,
  hasOptions = false,
  prices = null,
}: Props) {
  const { addToCart } = useCart()
  const [devices, setDevices] = useState(1)
  const [years, setYears] = useState(1)

  const unitPrice = hasOptions
    ? Number(prices?.[`${devices}-${years}`] ?? 0)
    : Number(price)
  const available = unitPrice > 0

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
    if (!available) return
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
                {DEVICE_OPTIONS.map((n) => (
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
                {YEAR_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'year' : 'years'}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {available ? (
            <p className="text-lg font-semibold text-[#E27A12]">
              Price: ₦{unitPrice.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm text-red-600">
              This combination is not available. Please choose another.
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={!available}
        className="bg-[#E27A12] text-white px-6 py-3 rounded-lg hover:bg-[#c96a0f] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>
    </div>
  )
}