"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { ShoppingCart } from 'lucide-react'

export default function Header() {
  const { cartCount } = useCart()
  const { user, firstName, signOut } = useAuth()

  return (
    <header className="bg-[#221610] text-white">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
           src="/logo.png"
            alt="Javnet"
             width={40}
            height={40}
             className="brightness-0 invert"
/>
            <div className="leading-tight">
              <p className="font-bold text-sm">Javnet</p>
              <p className="text-xs text-gray-400">Marketplace</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <button onClick={() => signOut()} className="hover:text-[#E27A12] transition">
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="hover:text-[#E27A12] transition">
                Sign In
              </Link>
            )}

            <Link
        href="/cart"
         className="relative bg-[#E27A12] text-white p-2.5 rounded-full hover:bg-[#c96a0f] transition"
          >
  <ShoppingCart size={20} />
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-white text-[#221610] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {cartCount}
    </span>
  )}
</Link>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-sm">
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#E27A12] transition">
              Home
            </Link>
            <Link href="/" className="hover:text-[#E27A12] transition">
              Categories
            </Link>
            {user && (
              <Link href="/orders" className="hover:text-[#E27A12] transition">
                Orders
              </Link>
            )}
          </nav>

          {user && (
            <span className="text-gray-300 truncate max-w-[140px] sm:max-w-none">
              {firstName ? `Hi, ${firstName}` : user.email}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}