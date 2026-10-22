import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://marketplace.javnet.com.ng'

export const revalidate = 3600

function toDate(value?: string | null) {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase.from('products').select('id, created_at')
  const { data: categories } = await supabase.from('categories').select('slug')
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, created_at')
    .eq('published', true)

  const pages: MetadataRoute.Sitemap = ['', '/blog', '/terms', '/delivery-policy', '/refund-policy'].map(
    (path) => ({ url: `${BASE}${path}` })
  )

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE}/?category=${c.slug}`,
  }))

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => {
    const date = toDate(p.created_at)
    return { url: `${BASE}/products/${p.id}`, ...(date ? { lastModified: date } : {}) }
  })

  const postPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => {
    const date = toDate(p.created_at)
    return { url: `${BASE}/blog/${p.slug}`, ...(date ? { lastModified: date } : {}) }
  })

  return [...pages, ...categoryPages, ...productPages, ...postPages]
}