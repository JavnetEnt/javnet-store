export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-[#221610]">Delivery Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Software Products</h2>
          <p>Software license keys are delivered digitally. Once your payment is confirmed, your license key will be made available in your account under "Orders." In most cases, this happens within a few hours of payment confirmation; during busy periods, it may take up to 24 hours. You do not need to do anything further — simply check your Orders page for the key once ready.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Physical Products (PCs & Gadgets)</h2>
          <p>Physical items are shipped to the delivery address you provide at checkout. Delivery timelines depend on your location within Nigeria:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Within Lagos: 1–3 business days</li>
            <li>Other states: 3–7 business days</li>
          </ul>
          <p className="mt-2">You will be able to track the status of your order (Pending / Delivered) on your Orders page. We will also reach out via the phone number or email provided at checkout if there are any delays.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Delivery Address Accuracy</h2>
          <p>Please ensure the delivery address and phone number you provide are accurate and complete. Javnet Technologies is not responsible for delays or non-delivery resulting from incorrect address information provided by the customer.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Delivery Charges</h2>
          <p>Any applicable delivery charges will be communicated to you before or during checkout. There are no hidden delivery fees.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Questions About Your Delivery</h2>
          <p>If you have questions about the status of your order, please contact us via the details on our <a href="https://javnet.com.ng/contact" className="text-[#E27A12] hover:underline">main website</a>.</p>
        </section>
      </div>
    </div>
  )
}