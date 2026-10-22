"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Category = { id: string; name: string; parent_id: string | null }
type Product = {
  id: string
  name: string
  description: string
  base_price: number
  category_id: string
  brand: string
  image_url: string
  stock_count: number
  has_license_options: boolean
  license_prices: Record<string, number> | null
}

const DEVICE_ROWS = Array.from({ length: 25 }, (_, i) => i + 1)
const YEAR_COLS = Array.from({ length: 5 }, (_, i) => i + 1)

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [stockCount, setStockCount] = useState('')
  const [hasOptions, setHasOptions] = useState(false)
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [pasteText, setPasteText] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: cats } = await supabase.from('categories').select('*')
    setCategories(cats ?? [])
    const { data: prods } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(prods ?? [])
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setName(product.name)
    setDescription(product.description ?? '')
    setBasePrice(String(product.base_price))
    setCategoryId(product.category_id)
    setBrand(product.brand ?? '')
    setImageUrl(product.image_url ?? '')
    setStockCount(String(product.stock_count ?? 0))
    setHasOptions(!!product.has_license_options)
    const asStrings: Record<string, string> = {}
    Object.entries(product.license_prices ?? {}).forEach(([k, v]) => {
      asStrings[k] = String(v)
    })
    setPrices(asStrings)
    setPasteText('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setName('')
    setDescription('')
    setBasePrice('')
    setCategoryId('')
    setBrand('')
    setImageUrl('')
    setStockCount('')
    setHasOptions(false)
    setPrices({})
    setPasteText('')
    setMessage('')
  }

  function fillFromBasePrice() {
    const base = Number(basePrice)
    if (!base) {
      setMessage('Enter the price for 1 device, 1 year first.')
      return
    }
    const next: Record<string, string> = {}
    DEVICE_ROWS.forEach((d) => {
      YEAR_COLS.forEach((y) => {
        next[`${d}-${y}`] = String(Math.round(base * d * y))
      })
    })
    setPrices(next)
  }

  function applyPaste() {
    const next: Record<string, string> = {}
    pasteText
      .trim()
      .split(/\r?\n/)
      .slice(0, 25)
      .forEach((row, i) => {
        row
          .trim()
          .split(/[\t ]+/)
          .slice(0, 5)
          .forEach((cell, j) => {
            const value = cell.replace(/[^0-9.]/g, '')
            if (value) next[`${i + 1}-${j + 1}`] = value
          })
      })
    setPrices(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    let licensePrices: Record<string, number> | null = null
    if (hasOptions) {
      licensePrices = {}
      Object.entries(prices).forEach(([key, value]) => {
        const n = Number(value)
        if (n > 0) licensePrices![key] = n
      })
      if (Object.keys(licensePrices).length === 0) {
        setMessage('Enter at least one price in the devices and years table.')
        return
      }
    }

    const payload = {
      name,
      description,
      base_price: Number(basePrice),
      category_id: categoryId,
      brand,
      image_url: imageUrl,
      stock_count: Number(stockCount) || 0,
      has_license_options: hasOptions,
      license_prices: licensePrices,
    }

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingId)
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        cancelEdit()
        setMessage('Product updated!')
        loadData()
      }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        cancelEdit()
        setMessage('Product added!')
        loadData()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      setMessage('Could not delete: ' + error.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (editingId === id) cancelEdit()
    loadData()
  }

  if (loading || !user || !isAdmin) {
    return <div className="p-6">Checking access...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex gap-4">
  <Link href="/admin/blog" className="text-sm text-[#E27A12] hover:underline">
    Manage Blog
  </Link>
  <Link href="/admin/orders" className="text-sm text-[#E27A12] hover:underline">
    View Orders
  </Link>
</div>

      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-lg mb-8">
        <h2 className="font-semibold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Description (one point per line)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price (for options products: price for 1 device, 1 year)"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Stock count"
          value={stockCount}
          onChange={(e) => setStockCount(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select category</option>
          {categories
            .filter((cat) => !cat.parent_id)
            .map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                <option value={cat.id}>{cat.name} (general)</option>
                {categories
                  .filter((sub) => sub.parent_id === cat.id)
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      - {sub.name}
                    </option>
                  ))}
              </optgroup>
            ))}
        </select>
        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasOptions}
            onChange={(e) => setHasOptions(e.target.checked)}
          />
          Offer devices (1-25) and years (1-5) options with their own prices
        </label>

        {hasOptions && (
          <div className="border rounded p-3 space-y-3 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fillFromBasePrice}
                className="border px-3 py-1 rounded text-sm hover:border-[#E27A12] hover:text-[#E27A12]"
              >
                Fill from price x devices x years
              </button>
              <button
                type="button"
                onClick={() => setPrices({})}
                className="border px-3 py-1 rounded text-sm hover:border-red-400 hover:text-red-600"
              >
                Clear all
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">
                Or paste from a spreadsheet: 25 rows (devices 1 to 25), 5 columns (years 1 to 5).
              </p>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={3}
                placeholder="Paste prices here"
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={applyPaste}
                className="mt-1 border px-3 py-1 rounded text-sm hover:border-[#E27A12] hover:text-[#E27A12]"
              >
                Apply pasted prices
              </button>
            </div>

            <div className="max-h-96 overflow-auto border rounded bg-white">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="text-left p-2">Devices</th>
                    {YEAR_COLS.map((y) => (
                      <th key={y} className="p-2 text-left">
                        {y} {y === 1 ? 'year' : 'years'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEVICE_ROWS.map((d) => (
                    <tr key={d} className="border-t">
                      <td className="p-2 font-medium">{d}</td>
                      {YEAR_COLS.map((y) => (
                        <td key={y} className="p-1">
                          <input
                            type="number"
                            value={prices[`${d}-${y}`] ?? ''}
                            onChange={(e) =>
                              setPrices((prev) => ({ ...prev, [`${d}-${y}`]: e.target.value }))
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              Leave a cell empty if that combination is not sold.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#E27A12] text-white px-4 py-2 rounded-lg hover:bg-[#c96a0f] transition"
          >
            {editingId ? 'Save Changes' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
        {message && <p className="text-sm">{message}</p>}
      </form>

      <h2 className="font-semibold mb-3">Existing Products</h2>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">
                {Number(p.base_price).toLocaleString()} - Stock: {p.stock_count ?? 0}
                {p.has_license_options ? ' - Devices/years options' : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(p)}
                className="text-[#E27A12] text-sm hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}