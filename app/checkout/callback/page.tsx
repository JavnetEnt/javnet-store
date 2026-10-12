"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { items, removeFromCart } = useCart()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      setStatus('error')
      return
    }

    fetch(`/api/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus('error')
        } else {
          setOrderId(data.orderId)
          setStatus('success')
          items.forEach((item) => removeFromCart(item.key))
        }
      })
      .catch(() => setStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'verifying') {
    return <div className="p-6 text-center">Verifying your payment...</div>
  }

  if (status === 'error') {
    return (
      <div className="p-6 text-center text-red-600">
        Something went wrong verifying your payment. Please contact support with your reference number.
      </div>
    )
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold text-green-700">Payment Successful!</h1>
      <p className="mt-2 text-gray-600">Your order has been placed.</p>
      <p className="text-sm text-gray-400 mt-1">Order ID: {orderId}</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-[#E27A12] text-white px-6 py-2 rounded-lg hover:bg-[#c96a0f] transition"
      >
        Continue Shopping
      </button>
    </div>
  )
}

export default function CheckoutCallback() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <CallbackContent />
    </Suspense>
  )
}