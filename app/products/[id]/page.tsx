import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/app/components/AddToCartButton'
import RecentlyViewedTracker from '@/app/components/RecentlyViewedTracker'
import RecentlyViewed from '@/app/components/RecentlyViewed'

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

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <RecentlyViewedTracker productId={product.id} />

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
          <ul className="mt-4 space-y-2 text-gray-700">
          {product.description
           ?.split('\n')
           .filter((line: string) => line.trim() !== '')
           .map((line: string, i: number) => (
      <li key={i} className="flex gap-2">
        <span className="text-[#E27A12] mt-1">•</span>
        <span>{line.trim()}</span>
      </li>
    ))}
</ul>

          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.base_price}
            image_url={product.image_url}
          />
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold mb-4 text-[#221610]">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#E27A12] transition">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <h3 className="font-medium mt-2 text-sm text-[#221610]">{p.name}</h3>
                  <p className="text-[#E27A12] text-sm font-medium">
                    ₦{Number(p.base_price).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <RecentlyViewed excludeId={product.id} />
    </div>
  )
}