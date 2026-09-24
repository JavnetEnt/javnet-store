import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const { data: categories } = await supabase.from('categories').select('*')

  let query = supabase.from('products').select('*')
  if (category) {
    const cat = categories?.find((c) => c.slug === category)
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data: products, error } = await query

  if (error) {
    return <div className="p-6 text-red-600">Error loading products: {error.message}</div>
  }

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-6 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full border ${
            !category ? 'bg-black text-white' : ''
          }`}
        >
          All
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full border ${
              category === cat.slug ? 'bg-black text-white' : ''
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products?.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-md transition">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600">₦{Number(product.base_price).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}