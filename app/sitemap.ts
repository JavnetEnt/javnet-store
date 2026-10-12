import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://marketplace.javnet.com.ng'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase.from('products').select('id, created_at')
  const { data: categories } = await supabase.from('categories').select('slug')

  const pages: MetadataRoute.Sitemap = ['', '/terms', '/delivery-policy', '/refund-policy'].map(
    (path) => ({ url: `${BASE}${path}` })
  )

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE}/?category=${c.slug}`,
  }))

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: p.created_at,
  }))

  return [...pages, ...categoryPages, ...productPages]
}