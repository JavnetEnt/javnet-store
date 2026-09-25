"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PAGE_SIZE = 10

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']

type OrderItem = {
  id: string
  product_name: string
  quantity: number
  price: number
  is_software: boolean
  delivered: boolean
  delivery_status: string
  tracking_number: string | null
  courier_name: string | null
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
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})
  const [courierInputs, setCourierInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadOrders()
  }, [page])

  async function loadOrders() {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count } = await supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    setOrders(data ?? [])
    setTotalCount(count ?? 0)

    const tInit: Record<string, string> = {}
    const cInit: Record<string, string> = {}
    data?.forEach((order) => {
      order.order_items.forEach((item: OrderItem) => {
        tInit[item.id] = item.tracking_number ?? ''
        cInit[item.id] = item.courier_name ?? ''
      })
    })
    setTrackingInputs(tInit)
    setCourierInputs(cInit)
  }

  async function markSoftwareDelivered(itemId: string) {
    await supabase.from('order_items').update({ delivered: true }).eq('id', itemId)
    loadOrders()
  }

  async function updateDeliveryStatus(itemId: string, status: string) {
    await supabase.from('order_items').update({ delivery_status: status }).eq('id', itemId)
    loadOrders()
  }

  async function saveTracking(itemId: string) {
    await supabase
      .from('order_items')
      .update({
        tracking_number: trackingInputs[itemId] || null,
        courier_name: courierInputs[itemId] || null,
      })
      .eq('id', itemId)
    loadOrders()
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  if (loading || !user || !isAdmin) {
    return <div className="p-6">Checking access...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Orders</h1>
        <Link href="/admin" className="text-sm text-[#E27A12] hover:underline">
          Back to Manage Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer_email} - {order.customer_phone}
                    </p>
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

                <div className="space-y-4 mt-3 border-t pt-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {item.product_name} x {item.quantity}
                          {item.is_software && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Software
                            </span>
                          )}
                        </span>
                        <span>NGN {Number(item.price * item.quantity).toLocaleString()}</span>
                      </div>

                      {item.is_software ? (
                        <div>
                          {item.delivered ? (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                              License key sent
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                Deliver license key via email
                              </span>
                              <button
                                onClick={() => markSoftwareDelivered(item.id)}
                                className="bg-[#E27A12] text-white px-3 py-1 rounded text-sm hover:bg-[#c96a0f] transition"
                              >
                                Mark License Sent
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            {STATUS_STEPS.map((step) => (
                              <button
                                key={step}
                                onClick={() => updateDeliveryStatus(item.id, step)}
                                className={`text-xs px-3 py-1 rounded-full border capitalize transition ${
                                  item.delivery_status === step
                                    ? 'bg-[#221610] text-white border-[#221610]'
                                    : 'border-gray-300 text-gray-600 hover:border-[#E27A12] hover:text-[#E27A12]'
                                }`}
                              >
                                {step}
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              placeholder="Courier name (optional)"
                              value={courierInputs[item.id] ?? ''}
                              onChange={(e) =>
                                setCourierInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                              }
                              className="flex-1 border rounded px-2 py-1 text-sm"
                            />
                            <input
                              placeholder="Tracking number (optional)"
                              value={trackingInputs[item.id] ?? ''}
                              onChange={(e) =>
                                setTrackingInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                              }
                              className="flex-1 border rounded px-2 py-1 text-sm"
                            />
                            <button
                              onClick={() => saveTracking(item.id)}
                              className="bg-[#221610] text-white px-3 py-1 rounded text-sm hover:bg-black transition"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mt-3 border-t pt-2">
                  Delivering to: {order.delivery_address}
                </p>
                <p className="text-sm text-gray-500">
                  Total: <span className="font-semibold text-[#221610]">NGN {Number(order.total_amount).toLocaleString()}</span>
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded border text-sm hover:border-[#E27A12] hover:text-[#E27A12] disabled:opacity-40 disabled:pointer-events-none"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded border text-sm hover:border-[#E27A12] hover:text-[#E27A12] disabled:opacity-40 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}