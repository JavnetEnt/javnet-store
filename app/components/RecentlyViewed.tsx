"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  base_price: number
  image_url: string
}

export default function RecentlyViewed({ excludeId }: { excludeId: string }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem('recently-viewed')
        const ids: string[] = stored ? JSON.parse(stored) : []
        const filtered = ids.filter((id) => id !== excludeId).slice(0, 4)

        if (filtered.length === 0) return

        const { data } = await supabase
          .from('products')
          .select('id, name, base_price, image_url')
          .in('id', filtered)

        if (data) {
          const ordered = filtered
            .map((id) => data.find((p) => p.id === id))
            .filter(Boolean) as Product[]
          setProducts(ordered)
        }
      } catch {
        // ignore
      }
    }
    load()
  }, [excludeId])

  if (products.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-lg font-bold mb-4 text-[#221610]">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`}>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#E27A12] transition">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-medium mt-2 text-sm text-[#221610]">{p.name}</h3>
              <p className="text-[#E27A12] text-sm font-medium">
                ₦{Number(p.base_price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}