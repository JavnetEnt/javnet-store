"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type CartItem = {
  key: string
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
  devices?: number
  years?: number
}

type NewItem = Omit<CartItem, 'quantity' | 'key'>

type CartContextType = {
  items: CartItem[]
  addToCart: (item: NewItem) => void
  removeFromCart: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function makeKey(item: NewItem) {
  return `${item.id}|${item.devices ?? ''}|${item.years ?? ''}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('javnet-cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItems(parsed.map((i: any) => ({ ...i, key: i.key ?? i.id })))
      } catch {
        // ignore corrupted data
      }
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('javnet-cart', JSON.stringify(items))
    }
  }, [items, loaded])

  function addToCart(item: NewItem) {
    const key = makeKey(item)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, key, quantity: 1 }]
    })
  }

  function removeFromCart(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(key)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    )
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}