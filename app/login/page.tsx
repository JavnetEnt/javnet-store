"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  const { signUp, signIn } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      setLoading(false)

      if (error) {
        setError(error)
      } else {
        setCheckEmail(true)
      }
      return
    }

    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      router.push('/')
    }
  }

  if (checkEmail) {
    return (
      <div className="max-w-sm mx-auto p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-600">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and sign in.
        </p>
        <button
          onClick={() => {
            setCheckEmail(false)
            setIsSignUp(false)
          }}
          className="mt-6 text-[#E27A12] underline text-sm"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">
        {isSignUp ? 'Create an account' : 'Sign in'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded-lg px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E27A12] text-white py-2 rounded-lg hover:bg-[#c96a0f] transition disabled:opacity-50 font-medium"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-600 mt-4 underline"
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
    </div>
  )
}