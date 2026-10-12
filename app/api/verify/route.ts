import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ error: 'No reference provided' }, { status: 400 })
  }

  // Verify with Paystack
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  )
  const verifyData = await verifyRes.json()

  if (!verifyData.status || verifyData.data.status !== 'success') {
    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
  }

  const { metadata, amount } = verifyData.data

  // Check if order already exists (avoid duplicate on refresh)
  const { data: existing } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('paystack_reference', reference)
    .single()

  if (existing) {
    return NextResponse.json({ orderId: existing.id })
  }

  // Create the order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: metadata.user_id,
      customer_name: metadata.customer_name,
      customer_email: verifyData.data.customer.email,
      customer_phone: metadata.customer_phone,
      delivery_address: metadata.delivery_address,
      total_amount: amount / 100,
      status: 'paid',
      paystack_reference: reference,
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }

  // Insert order items
// Fetch each product's category to determine if it's software
const productIds = metadata.items.map((item: any) => item.product_id)
const { data: productsData } = await supabaseAdmin
  .from('products')
  .select('id, category_id')
  .in('id', productIds)

const { data: categoriesData } = await supabaseAdmin
  .from('categories')
  .select('id, parent_id, slug')

function isSoftwareCategory(categoryId: string): boolean {
  const cat = categoriesData?.find((c) => c.id === categoryId)
  if (!cat) return false
  if (cat.slug === 'software') return true
  if (cat.parent_id) {
    const parent = categoriesData?.find((c) => c.id === cat.parent_id)
    return parent?.slug === 'software'
  }
  return false
}

const orderItems = metadata.items.map((item: any) => {
  const product = productsData?.find((p) => p.id === item.product_id)
  const isSoftware = product ? isSoftwareCategory(product.category_id) : false

  return {
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
    is_software: isSoftware,
    devices: item.devices ?? null,
years: item.years ?? null,
  }
})

await supabaseAdmin.from('order_items').insert(orderItems)

  // Decrement stock for each product
  for (const item of metadata.items) {
    await supabaseAdmin.rpc('decrement_stock', {
      product_id: item.product_id,
      qty: item.quantity,
    })
  }

  return NextResponse.json({ orderId: order.id })
}