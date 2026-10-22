"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Search, ChevronDown } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'

type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

export default function Header() {
  const { cartCount } = useCart()
  const { user, firstName, signOut } = useAuth()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
      setCategories(data ?? [])
    }
    loadCategories()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/?q=${encodeURIComponent(q)}` : '/')
  }

  const topLevel = categories.filter((c) => !c.parent_id)

  return (
    <header className="bg-[#221610] text-white relative z-40">
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

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-3 pt-3 border-t border-white/10 text-sm">
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#E27A12] transition">
              Home
            </Link>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-1 hover:text-[#E27A12] transition"
              >
                Categories
                <ChevronDown
                  size={14}
                  className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-full mt-3 w-56 bg-white text-[#221610] rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-[#F5F1EC] hover:text-[#E27A12]"
                  >
                    All
                  </Link>
                  {topLevel.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        href={`/?category=${cat.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-[#F5F1EC] hover:text-[#E27A12]"
                      >
                        {cat.name}
                      </Link>
                      {categories
                        .filter((sub) => sub.parent_id === cat.id)
                        .map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/?category=${sub.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="block pl-8 pr-4 py-1.5 text-gray-600 text-[13px] hover:bg-[#F5F1EC] hover:text-[#E27A12]"
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

          <Link href="/blog" className="hover:text-[#E27A12] transition">
  Blog
</Link>

{user && (
  <Link href="/orders" className="hover:text-[#E27A12] transition">
    Orders
  </Link>
)}
          </nav>

          <form
            onSubmit={handleSearch}
            className="order-last w-full md:order-none md:w-auto md:flex-1 md:max-w-md md:mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full px-4 py-2 pr-10 focus:outline-none focus:bg-white/15 focus:ring-1 focus:ring-[#E27A12]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#E27A12]"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {user && (
            <span className="ml-auto text-gray-300 truncate max-w-[140px] sm:max-w-none">
              {firstName ? `Hi, ${firstName}` : user.email}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}