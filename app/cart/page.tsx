"use client"

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/" className="text-black underline mt-2 inline-block">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-4 border-b pb-4">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-medium">{item.name}</h2>
              {item.devices && item.years && (
                <p className="text-xs text-gray-500">
                  {item.devices} {item.devices === 1 ? 'device' : 'devices'}, {item.years} {item.years === 1 ? 'year' : 'years'}
                </p>
              )}
              <p className="text-gray-600">₦{Number(item.price).toLocaleString()}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  className="border border-gray-300 px-2 rounded hover:border-[#E27A12] hover:text-[#E27A12] transition"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  className="border border-gray-300 px-2 rounded hover:border-[#E27A12] hover:text-[#E27A12] transition"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.key)}
                  className="text-red-600 text-sm ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold">
              ₦{Number(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-lg font-bold">
        <span>Total</span>
        <span>₦{cartTotal.toLocaleString()}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block text-center w-full bg-[#E27A12] text-white py-3 rounded-lg hover:bg-[#c96a0f] transition font-medium"
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}