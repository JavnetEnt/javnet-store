import { Zap, BadgeCheck, ShieldCheck, Headphones } from 'lucide-react'

const badges = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    text: 'Instant email delivery for software, quick dispatch for hardware',
  },
  {
    icon: BadgeCheck,
    title: 'No Extra Charges',
    text: 'All our prices are fixed with no hidden fees',
  },
  {
    icon: ShieldCheck,
    title: 'Safe Payments',
    text: 'Pay securely with Paystack — cards and bank transfer',
  },
  {
    icon: Headphones,
    title: 'Reliable Support',
    text: 'Our team is here to help with any order issue',
  },
]

export default function TrustBadges() {
  return (
    <div className="bg-[#F5F1EC] border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon
          return (
            <div key={badge.title} className="flex items-start gap-3">
              <Icon size={28} className="text-[#221610] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-semibold text-sm text-[#221610]">{badge.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{badge.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}