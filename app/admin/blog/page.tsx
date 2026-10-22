"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Post = {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string
  image_url: string | null
  published: boolean
  created_at: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export default function AdminBlogPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [summary, setSummary] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
  }

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setSlugTouched(false)
    setSummary('')
    setImageUrl('')
    setContent('')
    setPublished(true)
  }

  function startEdit(post: Post) {
    setEditingId(post.id)
    setTitle(post.title)
    setSlug(post.slug)
    setSlugTouched(true)
    setSummary(post.summary ?? '')
    setImageUrl(post.image_url ?? '')
    setContent(post.content)
    setPublished(post.published)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const finalSlug = slugify(slug || title)
    if (!finalSlug) {
      setMessage('Enter a title or a slug.')
      return
    }

    const payload = {
      title,
      slug: finalSlug,
      summary: summary || null,
      image_url: imageUrl || null,
      content,
      published,
    }

    const { error } = editingId
      ? await supabase.from('posts').update(payload).eq('id', editingId)
      : await supabase.from('posts').insert(payload)

    if (error) {
      setMessage(
        error.message.includes('duplicate')
          ? 'That slug is already used by another post. Change it and try again.'
          : 'Error: ' + error.message
      )
      return
    }

    resetForm()
    setMessage(editingId ? 'Post updated.' : 'Post saved.')
    loadPosts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      setMessage('Could not delete: ' + error.message)
      return
    }
    if (editingId === id) resetForm()
    loadPosts()
  }

  if (loading || !user || !isAdmin) {
    return <div className="p-6">Checking access...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Admin - Blog</h1>
        <Link href="/admin" className="text-sm text-[#E27A12] hover:underline">
          Manage Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-lg mb-8">
        <h2 className="font-semibold">{editingId ? 'Edit post' : 'New post'}</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Slug (the end of the post's web address)"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Short summary (shown on the blog page and in Google)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Cover image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder={'Write your post here.\n\nStart a line with ## for a heading.\n\n- Start lines with a dash for a bullet list.'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={14}
          className="w-full border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published (untick to save as a draft that visitors cannot see)
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#E27A12] text-white px-4 py-2 rounded-lg hover:bg-[#c96a0f] transition"
          >
            {editingId ? 'Save changes' : 'Publish post'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
        {message && <p className="text-sm">{message}</p>}
      </form>

      <h2 className="font-semibold mb-3">All posts</h2>
      <div className="space-y-2">
        {posts.length === 0 && <p className="text-sm text-gray-500">No posts yet.</p>}
        {posts.map((p) => (
          <div key={p.id} className="flex justify-between items-center border p-3 rounded gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{p.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(p.created_at).toLocaleDateString('en-NG')} -{' '}
                {p.published ? 'Published' : 'Draft'}
              </p>
            </div>
            <div className="flex gap-3 shrink-0 text-sm">
              {p.published && (
                <Link href={`/blog/${p.slug}`} className="text-gray-600 hover:underline">
                  View
                </Link>
              )}
              <button onClick={() => startEdit(p)} className="text-[#E27A12] hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}