"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: string; name: string }
type Product = {
  id: string
  name: string
  description: string
  base_price: number
  category_id: string
  brand: string
  image_url: string
  stock_count: number
}

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
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
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
    setMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const payload = {
      name,
      description,
      base_price: Number(basePrice),
      category_id: categoryId,
      brand,
      image_url: imageUrl,
      stock_count: Number(stockCount) || 0,
    }

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId)
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        setMessage('Product updated!')
        cancelEdit()
        loadData()
      }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        setMessage('Product added!')
        cancelEdit()
        loadData()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    if (editingId === id) cancelEdit()
    loadData()
  }

  if (loading || !user || !isAdmin) {
    return <div className="p-6">Checking access...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-xl font-bold">Admin — Manage Products</h1>
  <Link href="/admin/orders" className="text-sm text-[#E27A12] hover:underline">
    View Orders →
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
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price (₦)"
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
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
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
        <div className="flex gap-2">
          <button type="submit" className="bg-[#E27A12] text-white px-4 py-2 rounded-lg hover:bg-[#c96a0f] transition">
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
                ₦{Number(p.base_price).toLocaleString()} · Stock: {p.stock_count ?? 0}
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