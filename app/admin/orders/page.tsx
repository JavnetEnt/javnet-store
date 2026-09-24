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
}

type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  total_amount: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function AdminOrdersPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    setOrders(data ?? [])

    const initial: Record<string, string> = {}
    data?.forEach((order) => {
      order.order_items.forEach((item: OrderItem) => {
        initial[item.id] = item.license_key ?? ''
      })
    })
    setKeyInputs(initial)
  }

  async function saveKey(itemId: string) {
    setSavingId(itemId)
    await supabase
      .from('order_items')
      .update({ license_key: keyInputs[itemId] })
      .eq('id', itemId)
    setSavingId(null)
    loadOrders()
  }

  if (loading || !user || !isAdmin) {
    return <div className="p-6">Checking access...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Orders</h1>
        <Link href="/admin" className="text-sm text-[#E27A12] hover:underline">
          ← Manage Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-gray-500">{order.customer_email} · {order.customer_phone}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString('en-NG')}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    order.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-3 mt-3 border-t pt-3">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>₦{Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        placeholder="Paste license key here"
                        value={keyInputs[item.id] ?? ''}
                        onChange={(e) =>
                          setKeyInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => saveKey(item.id)}
                        disabled={savingId === item.id}
                        className="bg-[#221610] text-white px-3 py-1 rounded text-sm hover:bg-black transition disabled:opacity-50"
                      >
                        {savingId === item.id ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-3 border-t pt-2">
                Total: <span className="font-semibold text-[#221610]">₦{Number(order.total_amount).toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}