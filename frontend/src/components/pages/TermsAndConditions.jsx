const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-14 px-4">
  <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Terms & Conditions
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>

    {/* Content */}
    <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using <strong>ShopMate</strong>, you agree to be bound
          by these Terms & Conditions. If you do not agree with any part of these
          terms, please do not use our services.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          2. User Accounts
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account information and for all activities that occur under your
          account. ShopMate reserves the right to suspend or terminate accounts
          that violate these terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          3. Orders & Payments
        </h2>
        <p>
          All orders placed through our platform are subject to product
          availability and payment confirmation. Prices are subject to change
          without notice.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          4. Shipping & Delivery
        </h2>
        <p>
          Delivery timelines are estimated and may vary due to location,
          logistics, or unforeseen circumstances. ShopMate is not liable for
          delays beyond its control.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          5. Returns & Refunds
        </h2>
        <p>
          Returns and refunds are processed in accordance with our return
          policy. Items must be returned in unused condition and original
          packaging where applicable.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          6. Intellectual Property
        </h2>
        <p>
          All content, logos, images, and materials on ShopMate are the
          intellectual property of ShopMate and may not be copied, reproduced,
          or distributed without written permission.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          7. Prohibited Activities
        </h2>
        <p>
          Users must not misuse the website, attempt unauthorized access,
          introduce harmful code, or engage in any activity that disrupts our
          services.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          8. Limitation of Liability
        </h2>
        <p>
          ShopMate shall not be liable for any indirect, incidental, or
          consequential damages arising from the use or inability to use our
          services.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          9. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these Terms & Conditions at any time.
          Changes will be effective immediately upon posting on this page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          10. Contact Information
        </h2>
        <p>
          If you have any questions about these Terms & Conditions, please
          contact us at{" "}
          <strong className="text-gray-900 dark:text-white">
            support@shopmate.com
          </strong>.
        </p>
      </section>

    </div>
  </div>
</div>

  );
};

export default TermsAndConditions;
