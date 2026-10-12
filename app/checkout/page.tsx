"use client"

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, cartTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        amount: cartTotal * 100, // kobo
        metadata: {
          user_id: user.id,
          customer_name: name,
          customer_phone: phone,
          delivery_address: address,
          items: items.map((i) => ({
            product_id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            devices: i.devices,
            years: i.years,
          })),
        },
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      setError(data.error)
    } else {
      window.location.href = data.authorization_url
    }
  }

  if (items.length === 0) {
    return <div className="p-6 text-center text-gray-500">Your cart is empty.</div>
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      <form onSubmit={handleCheckout} className="space-y-4">
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

             <button
                  type="submit"
                 disabled={loading}
                className="w-full bg-[#E27A12] text-white py-3 rounded-lg hover:bg-[#c96a0f] transition disabled:opacity-50 font-medium"
                >
          {loading ? 'Redirecting to payment...' : 'Pay Now'}
        </button>
      </form>
    </div>
  )
}