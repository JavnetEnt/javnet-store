export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-[#221610]">Refund & Cancellation Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Order Cancellations</h2>
          <p>You may request to cancel your order before it has been processed (i.e., before a software license key has been issued, or before a physical item has been shipped). Once a license key has been delivered or an item has shipped, the order can no longer be cancelled.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Software License Refunds</h2>
          <p>Due to the nature of digital products, software license keys are non-refundable once delivered, except in the following cases:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The license key provided is invalid or does not work</li>
            <li>You were charged for a product you did not receive</li>
            <li>A duplicate charge occurred due to a technical error</li>
          </ul>
          <p className="mt-2">If you experience any of the above, contact us within 7 days of purchase with your order details.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Physical Product Returns & Refunds</h2>
          <p>If a physical product arrives damaged, defective, or significantly different from what was ordered, you may request a return or refund within 7 days of delivery. To be eligible:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The item must be unused and in its original packaging</li>
            <li>You must provide proof of purchase (order ID)</li>
            <li>You must contact us to initiate the return before sending anything back</li>
          </ul>
          <p className="mt-2">Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. Approved refunds are processed back to your original payment method within 7–14 business days.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">Non-Refundable Situations</h2>
          <p>We do not offer refunds for change of mind, incorrect product selection by the customer, or license keys/products that have already been successfully delivered and used.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">How to Request a Refund or Cancellation</h2>
          <p>Contact us with your order ID and reason for the request via the details on our <a href="https://javnet.com.ng/contact" className="text-[#E27A12] hover:underline">main website</a>. We aim to respond within 48 hours.</p>
        </section>
      </div>
    </div>
  )
}