import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { email, metadata } = await req.json()
  const items = metadata?.items ?? []

  if (items.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 })
  }

  const ids = Array.from(new Set(items.map((i: any) => i.product_id)))
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, base_price, stock_count, has_license_options, license_prices')
    .in('id', ids as string[])

  const requested: Record<string, number> = {}
  const cleanItems: any[] = []
  let total = 0

  for (const item of items) {
    const p = products?.find((x) => x.id === item.product_id)
    if (!p) {
      return NextResponse.json(
        { error: 'A product in your cart is no longer available' },
        { status: 400 }
      )
    }

    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1))
    requested[p.id] = (requested[p.id] ?? 0) + qty
    if (requested[p.id] > (p.stock_count ?? 0)) {
      return NextResponse.json(
        { error: `${p.name} does not have enough stock for this order` },
        { status: 400 }
      )
    }

    let unitPrice = Number(p.base_price)
    let devices: number | null = null
    let years: number | null = null

    if (p.has_license_options) {
      devices = Math.min(25, Math.max(1, Math.floor(Number(item.devices) || 1)))
      years = Math.min(5, Math.max(1, Math.floor(Number(item.years) || 1)))
      const tablePrice = Number(p.license_prices?.[`${devices}-${years}`] ?? 0)
      if (!tablePrice) {
        return NextResponse.json(
          { error: `${p.name} is not available for ${devices} device(s) and ${years} year(s)` },
          { status: 400 }
        )
      }
      unitPrice = tablePrice
    }

    total += unitPrice * qty
    cleanItems.push({
      product_id: p.id,
      name: p.name,
      quantity: qty,
      price: unitPrice,
      devices,
      years,
    })
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
      metadata: { ...metadata, items: cleanItems },
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