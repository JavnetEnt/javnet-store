"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'

export default function Header() {
  const { cartCount } = useCart()
  const { user, signOut } = useAuth()

  return (
    <header className="bg-[#221610] text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Javnet" width={40} height={40} />
          <div className="leading-tight">
            <p className="font-bold text-sm">Javnet</p>
            <p className="text-xs text-gray-400">Marketplace</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-[#E27A12] transition">
            Home
          </Link>
          <Link href="/" className="hover:text-[#E27A12] transition">
            Categories
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
  <>
    <Link href="/orders" className="hover:text-[#E27A12] transition">
      Orders
    </Link>
    <span className="hidden sm:inline text-gray-300">{user.email}</span>
    <button onClick={() => signOut()} className="hover:text-[#E27A12] transition">
      Sign Out
    </button>
  </>
) : (
            <Link href="/login" className="hover:text-[#E27A12] transition">
              Sign In
            </Link>
          )}

          <Link
            href="/cart"
            className="relative bg-[#E27A12] text-white px-4 py-2 rounded-full font-medium hover:bg-[#c96a0f] transition"
          >
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-white text-[#221610] text-xs rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}