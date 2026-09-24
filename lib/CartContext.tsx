"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type CartItem = {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load cart from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem('javnet-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        // ignore corrupted data
      }
    }
    setLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('javnet-cart', JSON.stringify(items))
    }
  }, [items, loaded])

  function addToCart(item: Omit<CartItem, 'quantity'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
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