import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/app/components/AddToCartButton'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-[#E27A12] transition mb-4"
      >
        ← Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-1">{product.brand}</p>
          <p className="text-2xl font-semibold mt-4 text-[#E27A12]">
            ₦{Number(product.base_price).toLocaleString()}
          </p>
          <p className="text-gray-700 mt-4">{product.description}</p>

          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.base_price}
            image_url={product.image_url}
          />
        </div>
      </div>
    </div>
  )
}