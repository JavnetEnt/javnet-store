"use client"

import { useEffect } from 'react'

export default function RecentlyViewedTracker({ productId }: { productId: string }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recently-viewed')
      let ids: string[] = stored ? JSON.parse(stored) : []

      ids = ids.filter((id) => id !== productId)
      ids.unshift(productId)
      ids = ids.slice(0, 8)

      localStorage.setItem('recently-viewed', JSON.stringify(ids))
    } catch {
      // ignore storage errors
    }
  }, [productId])

  return null
}