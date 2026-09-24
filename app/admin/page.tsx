"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Category = { id: string; name: string }
type Product = {
  id: string
  name: string
  description: string
  base_price: number
  category_id: string
  brand: string
  image_url: string
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('')
  const [imageUrl, setImageUrl] = useState('')
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

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.from('products').insert({
      name,
      description,
      base_price: Number(basePrice),
      category_id: categoryId,
      brand,
      image_url: imageUrl,
    })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Product added!')
      setName('')
      setDescription('')
      setBasePrice('')
      setBrand('')
      setImageUrl('')
      loadData()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  if (loading || !user || !isAdmin) {
    return <div className="p-6">Checking access...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Admin — Manage Products</h1>

      <form onSubmit={handleAddProduct} className="space-y-3 border p-4 rounded-lg mb-8">
        <h2 className="font-semibold">Add New Product</h2>
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
        <button type="submit" className="bg-[#E27A12] text-white px-4 py-2 rounded-lg hover:bg-[#c96a0f] transition">
          Add Product
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>

      <h2 className="font-semibold mb-3">Existing Products</h2>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">₦{Number(p.base_price).toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}