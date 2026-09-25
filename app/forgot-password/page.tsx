"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await resetPassword(email)
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-600">
          If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.
        </p>
        <Link href="/login" className="mt-6 text-[#E27A12] underline text-sm inline-block">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-2">Reset your password</h1>
      <p className="text-gray-600 text-sm mb-4">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E27A12] text-white py-2 rounded-lg hover:bg-[#c96a0f] transition disabled:opacity-50 font-medium"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <Link href="/login" className="text-sm text-gray-600 mt-4 underline block text-center">
        Back to sign in
      </Link>
    </div>
  )
}