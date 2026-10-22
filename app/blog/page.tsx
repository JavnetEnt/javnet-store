import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 9

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Guides and tips on software licenses, antivirus, Windows, Office, laptops and PC gadgets in Nigeria.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)

  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const from = (safePage - 1) * PAGE_SIZE

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, summary, image_url, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#221610] mb-1">Blog</h1>
      <p className="text-sm text-gray-500 mb-8">
        Guides and tips on software, laptops and PC gadgets.
      </p>

      {!posts || posts.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-[#E27A12] transition h-full bg-white">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <h2 className="font-semibold text-[#221610] mt-1">{post.title}</h2>
                  {post.summary && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.summary}</p>
                  )}
                  <p className="text-sm text-[#E27A12] mt-3">Read more</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <Link
            href={safePage > 2 ? `/blog?page=${safePage - 1}` : '/blog'}
            className={`px-3 py-2 rounded border text-sm ${
              safePage === 1 ? 'pointer-events-none opacity-40' : 'hover:border-[#E27A12] hover:text-[#E27A12]'
            }`}
          >
            Prev
          </Link>
          <span className="text-sm text-gray-600">
            Page {safePage} of {totalPages}
          </span>
          <Link
            href={`/blog?page=${Math.min(totalPages, safePage + 1)}`}
            className={`px-3 py-2 rounded border text-sm ${
              safePage === totalPages ? 'pointer-events-none opacity-40' : 'hover:border-[#E27A12] hover:text-[#E27A12]'
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  )
}