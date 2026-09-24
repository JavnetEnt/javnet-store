import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, amount, metadata } = await req.json()

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount, // in kobo (₦1 = 100 kobo)
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