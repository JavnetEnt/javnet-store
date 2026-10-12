import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { email, metadata } = await req.json()
  const items = metadata?.items ?? []

  if (items.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 })
  }

  const ids = items.map((i: any) => i.product_id)
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, base_price, stock_count')
    .in('id', ids)

  let total = 0
  for (const item of items) {
    const p = products?.find((x) => x.id === item.product_id)
    if (!p) {
      return NextResponse.json(
        { error: 'A product in your cart is no longer available' },
        { status: 400 }
      )
    }
    if ((p.stock_count ?? 0) < item.quantity) {
      return NextResponse.json(
        { error: `${p.name} does not have enough stock for this order` },
        { status: 400 }
      )
    }
    total += Number(p.base_price) * item.quantity
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(total * 100),
      metadata,
      callback_url: `${req.nextUrl.origin}/checkout/callback`,
    }),
  })

  const data = await response.json()

  if (!data.status) {
    return NextResponse.json({ error: data.message }, { status: 400 })
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  })
}