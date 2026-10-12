import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

const PAGE_SIZE = 12

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>
}): Promise<Metadata> {
  const { category, page, q } = await searchParams

  if (q?.trim()) {
    return { title: `Search: ${q.trim()}`, robots: { index: false, follow: true } }
  }

  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (Number(page) > 1) params.set('page', String(Number(page)))
  const qs = params.toString()
  const canonical = qs ? `/?${qs}` : '/'

  if (category) {
    const { data } = await supabase
      .from('categories')
      .select('name')
      .eq('slug', category)
      .maybeSingle()
    if (data) {
      return {
        title: `${data.name} for Sale in Nigeria`,
        description: `Shop ${data.name} at Javnet Marketplace. Genuine products, secure payment and fast delivery in Nigeria.`,
        alternates: { canonical },
      }
    }
  }

  return { alternates: { canonical } }
}
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>
}) {
  const { category, page, q } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)
  const searchTerm = q?.trim() ?? ''

  const { data: categories } = await supabase.from('categories').select('*')

  const selectedCategory = category
    ? categories?.find((c) => c.slug === category)
    : undefined

  let categoryIdsToMatch: string[] = []
  if (selectedCategory) {
    const childIds =
      categories?.filter((c) => c.parent_id === selectedCategory.id).map((c) => c.id) ?? []
    categoryIdsToMatch = [selectedCategory.id, ...childIds]
  }

  let countQuery = supabase.from('products').select('*', { count: 'exact', head: true })
  if (categoryIdsToMatch.length > 0) countQuery = countQuery.in('category_id', categoryIdsToMatch)
  if (searchTerm) countQuery = countQuery.ilike('name', `%${searchTerm}%`)
  const { count } = await countQuery

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const from = (safePage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to)
  if (categoryIdsToMatch.length > 0) query = query.in('category_id', categoryIdsToMatch)
  if (searchTerm) query = query.ilike('name', `%${searchTerm}%`)

  const { data: products, error } = await query

  if (error) {
    return <div className="p-6 text-red-600">Error loading products: {error.message}</div>
  }

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (searchTerm) params.set('q', searchTerm)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  const heading = searchTerm
    ? `Results for "${searchTerm}"`
    : selectedCategory
    ? selectedCategory.name
    : 'All Products'

  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-xl font-bold text-[#221610]">{heading}</h1>
        <p className="text-sm text-gray-500">
          {count ?? 0} product{count === 1 ? '' : 's'}
        </p>
      </div>

      {products && products.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No products found.</p>
      ) : (
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
                <p className="text-[#E27A12] font-medium">
                  {product.has_license_options ? 'From ' : ''}₦{Number(product.base_price).toLocaleString()}
                </p>
                {(product.stock_count ?? 0) <= 0 && (
                  <p className="text-xs text-red-600 font-medium mt-1">Out of stock</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

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