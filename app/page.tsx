import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const PAGE_SIZE = 12

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)

  const { data: categories } = await supabase.from('categories').select('*')

  let categoryId: string | null = null
  if (category) {
    const cat = categories?.find((c) => c.slug === category)
    if (cat) categoryId = cat.id
  }

  let countQuery = supabase.from('products').select('*', { count: 'exact', head: true })
  if (categoryId) countQuery = countQuery.eq('category_id', categoryId)
  const { count } = await countQuery

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const from = (safePage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase.from('products').select('*').range(from, to)
  if (categoryId) query = query.eq('category_id', categoryId)

  const { data: products, error } = await query

  if (error) {
    return <div className="p-6 text-red-600">Error loading products: {error.message}</div>
  }

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-6 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full border transition ${
            !category
              ? 'bg-[#221610] text-white border-[#221610]'
              : 'border-gray-300 text-gray-700 hover:border-[#E27A12] hover:text-[#E27A12]'
          }`}
        >
          All
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full border transition ${
              category === cat.slug
                ? 'bg-[#221610] text-white border-[#221610]'
                : 'border-gray-300 text-gray-700 hover:border-[#E27A12] hover:text-[#E27A12]'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products?.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#E27A12] transition">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold mt-2 text-[#221610]">{product.name}</h2>
              <p className="text-[#E27A12] font-medium">₦{Number(product.base_price).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Link
            href={pageHref(Math.max(1, safePage - 1))}
            className={`px-3 py-2 rounded border text-sm ${
              safePage === 1
                ? 'pointer-events-none opacity-40'
                : 'hover:border-[#E27A12] hover:text-[#E27A12]'
            }`}
          >
            ← Prev
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`px-3 py-2 rounded border text-sm ${
                p === safePage
                  ? 'bg-[#221610] text-white border-[#221610]'
                  : 'hover:border-[#E27A12] hover:text-[#E27A12]'
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={pageHref(Math.min(totalPages, safePage + 1))}
            className={`px-3 py-2 rounded border text-sm ${
              safePage === totalPages
                ? 'pointer-events-none opacity-40'
                : 'hover:border-[#E27A12] hover:text-[#E27A12]'
            }`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  )
}