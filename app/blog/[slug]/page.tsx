import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

async function getPost(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post not found', robots: { index: false } }
  }

  const description = (post.summary || post.content).slice(0, 155)

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `/blog/${slug}`,
      images: post.image_url ? [{ url: post.image_url }] : undefined,
    },
  }
}

function renderContent(content: string) {
  return content.split(/\n\s*\n/).map((block, i) => {
    const text = block.trim()
    if (!text) return null

    if (text.startsWith('## ')) {
      return (
        <h2 key={i} className="text-xl font-bold text-[#221610] mt-8 mb-3">
          {text.slice(3)}
        </h2>
      )
    }

    const lines = text.split('\n').map((l) => l.trim())
    if (lines.every((l) => l.startsWith('- '))) {
      return (
        <ul key={i} className="list-disc pl-5 space-y-1 my-4">
          {lines.map((l, j) => (
            <li key={j}>{l.slice(2)}</li>
          ))}
        </ul>
      )
    }

    return (
      <p key={i} className="my-4 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    )
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image_url || undefined,
    datePublished: post.created_at,
    author: { '@type': 'Organization', name: 'Javnet Technologies' },
    publisher: { '@type': 'Organization', name: 'Javnet Marketplace' },
  }

  return (
    <article className="max-w-3xl mx-auto p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Link
        href="/blog"
        className="inline-block text-sm text-gray-600 hover:text-[#E27A12] transition mb-4"
      >
        ← Back to blog
      </Link>

      <h1 className="text-3xl font-bold text-[#221610]">{post.title}</h1>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(post.created_at).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        - Javnet Technologies
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full max-h-96 object-cover rounded-lg mt-6"
        />
      )}

      <div className="mt-6 text-gray-700">{renderContent(post.content)}</div>

      <div className="mt-10 border-t pt-6">
        <p className="text-sm text-gray-600">Ready to buy?</p>
        <Link
          href="/"
          className="inline-block mt-2 bg-[#E27A12] text-white px-5 py-2 rounded-lg hover:bg-[#c96a0f] transition font-medium"
        >
          Shop the marketplace
        </Link>
      </div>
    </article>
  )
}