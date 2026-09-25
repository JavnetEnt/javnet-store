export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-[#221610]">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">1. About Us</h2>
          <p>Javnet Marketplace is operated by Javnet Technologies. We sell software licenses, PCs, and PC gadgets/accessories to customers in Nigeria and beyond. By placing an order on this website, you agree to the terms outlined below.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">2. Orders and Payment</h2>
          <p>All orders must be paid for in full at checkout via our secure payment processor, Paystack. We accept major debit/credit cards and bank transfers. All prices are listed in Nigerian Naira (₦) and are subject to change without prior notice, though the price you pay at checkout is final for that order.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">3. Product Accuracy</h2>
          <p>We make every effort to ensure product descriptions, images, and pricing are accurate. However, we do not warrant that product descriptions or other content are error-free. If a product is listed at an incorrect price due to a technical error, we reserve the right to cancel the order and issue a full refund.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">4. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account login details and for all activities that occur under your account. Please contact us immediately if you suspect unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">5. Software Licenses</h2>
          <p>Software products sold on this site are genuine, licensed products. License keys are delivered digitally and are for single use on the license terms specified by the software manufacturer. Once a license key has been delivered, the sale is final except where covered under our Refund Policy.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">6. Limitation of Liability</h2>
          <p>Javnet Technologies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or this website.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">7. Changes to These Terms</h2>
          <p>We may update these Terms & Conditions from time to time. Continued use of this website after changes are posted constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-[#221610] mb-2">8. Contact Us</h2>
          <p>For questions about these terms, please reach us via the contact details on our <a href="https://javnet.com.ng" className="text-[#E27A12] hover:underline">main website</a>.</p>
        </section>
      </div>
    </div>
  )
}