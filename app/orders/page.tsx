"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type OrderItem = {
  id: string
  product_name: string
  quantity: number
  price: number
  license_key: string | null
  is_software: boolean
  delivered: boolean
}

type Order = {
  id: string
  customer_name: string
  delivery_address: string
  total_amount: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) loadOrders()
  }, [user])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    setOrders(data ?? [])
    setLoadingOrders(false)
  }

  if (loading || !user) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Your Orders</h1>

      {loadingOrders ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>You haven't placed any orders yet.</p>
          <Link href="/" className="text-[#E27A12] underline mt-2 inline-block">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`	ext-xs px-3 py-1 rounded-full font-medium ${
                    order.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>NGN {Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.is_software && (
                      <p className="text-xs mt-1">
                        {item.delivered ? (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded inline-block">
                            Sent: License key sent to your email
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                            Your license key will be sent to your email shortly
                          </span>
                        )}
                      </p>
                    )}
                    {!item.is_software && (
                      <p className="text-xs mt-1">
                        {item.delivered ? (
                          <span className="text-green-700">Delivered</span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <p className="text-sm text-gray-500">
                  Delivering to: {order.delivery_address}
                </p>
                <p className="font-semibold">
                  NGN {Number(order.total_amount).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
