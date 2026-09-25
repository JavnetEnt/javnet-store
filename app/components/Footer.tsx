import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#F5F1EC] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-5 gap-8"></div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image src="/logo.png" alt="Javnet" width={36} height={36} />
            <div>
              <p className="font-bold text-[#221610] text-sm">Javnet</p>
              <p className="text-xs text-gray-500">Marketplace</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Quality software, PCs and PC gadgets from Javnet Technologies.
          </p>
          <a href="https://javnet.com.ng" className="text-[#E27A12] text-sm mt-2 inline-block hover:underline">
            javnet.com.ng
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 mb-3">SHOP</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link href="/?category=laptops" className="hover:text-[#E27A12]">Laptops</Link></li>
            <li><Link href="/?category=desktops" className="hover:text-[#E27A12]">Desktops</Link></li>
            <li><Link href="/?category=accessories" className="hover:text-[#E27A12]">Accessories</Link></li>
            <li><Link href="/?category=software" className="hover:text-[#E27A12]">Software</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 mb-3">ACCOUNT</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link href="/cart" className="hover:text-[#E27A12]">Cart</Link></li>
            <li><Link href="/login" className="hover:text-[#E27A12]">Sign In</Link></li>
          </ul>
        </div>

        <div>
  <h3 className="text-xs font-semibold tracking-wider text-gray-500 mb-3">
    COMPANY
  </h3>
  <ul className="space-y-2 text-sm text-gray-700">
    <li><a href="https://javnet.com.ng/about" className="hover:text-[#E27A12]">About</a></li>
    <li><a href="https://javnet.com.ng/contact" className="hover:text-[#E27A12]">Contact</a></li>
    <li><a href="https://javnet.com.ng" className="hover:text-[#E27A12]">Main Site</a></li>
  </ul>
</div>

<div>
  <h3 className="text-xs font-semibold tracking-wider text-gray-500 mb-3">
    POLICIES
  </h3>
  <ul className="space-y-2 text-sm text-gray-700">
    <li><Link href="/terms" className="hover:text-[#E27A12]">Terms & Conditions</Link></li>
    <li><Link href="/delivery-policy" className="hover:text-[#E27A12]">Delivery Policy</Link></li>
    <li><Link href="/refund-policy" className="hover:text-[#E27A12]">Refund Policy</Link></li>
  </ul>
</div>

      <div className="border-t border-gray-300 py-4 text-center text-xs text-gray-500">
        (c) Javnet Technologies. All rights reserved.
      </div>
    </footer>
  )
}
