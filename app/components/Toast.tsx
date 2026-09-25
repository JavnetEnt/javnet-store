"use client"

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

type ToastMessage = {
  id: number
  text: string
}

let listeners: ((message: string) => void)[] = []

export function showToast(message: string) {
  listeners.forEach((listener) => listener(message))
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const listener = (text: string) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, text }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 2500)
    }
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]"
        >
          <CheckCircle size={18} />
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      ))}
    </div>
  )
}