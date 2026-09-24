"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  firstName: string | null
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
const [isAdmin, setIsAdmin] = useState(false)
const [firstName, setFirstName] = useState<string | null>(null)

async function checkAdmin(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('is_admin, first_name')
    .eq('id', userId)
    .single()
  setIsAdmin(data?.is_admin ?? false)
  setFirstName(data?.first_name ?? null)
}

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
    setUser(session?.user ?? null)
    if (session?.user) await checkAdmin(session.user.id)
    setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user ?? null)
  if (session?.user) {
    checkAdmin(session.user.id)
  } else {
    setIsAdmin(false)
    setFirstName(null)
  }
})

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      },
    },
  })
  return { error: error?.message ?? null }
}

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, firstName, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}