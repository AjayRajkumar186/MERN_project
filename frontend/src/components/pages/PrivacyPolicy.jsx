const PrivacyPolicy = () => {
  return (
 <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-14 px-4">
  <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>

    {/* Content */}
    <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          1. Introduction
        </h2>
        <p>
          Welcome to <strong>ShopMate</strong>. We respect your privacy and are
          committed to protecting your personal information. This Privacy Policy
          explains how we collect, use, and safeguard your data when you use our
          website or services.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          2. Information We Collect
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Personal details such as name, email, phone number, and address</li>
          <li>Order and payment-related information</li>
          <li>Device, browser, and usage data</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To process orders and deliver products</li>
          <li>To communicate order updates and support requests</li>
          <li>To improve our website, services, and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          4. Sharing of Information
        </h2>
        <p>
          We do not sell or rent your personal data. Information may be shared
          only with trusted partners such as payment gateways and delivery
          services, strictly for order fulfillment.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          5. Data Security
        </h2>
        <p>
          We implement appropriate security measures to protect your personal
          data from unauthorized access, misuse, or disclosure. However, no
          method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          6. Cookies
        </h2>
        <p>
          We use cookies to enhance your browsing experience, analyze site
          traffic, and personalize content. You can control cookies through your
          browser settings.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          7. Your Rights
        </h2>
        <p>
          You have the right to access, update, or delete your personal
          information. If you have concerns about your data, please contact our
          support team.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          8. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated revision date.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          9. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy, you can reach us
          at <strong className="text-gray-900 dark:text-white">support@shopmate.com</strong>.
        </p>
      </section>

    </div>
  </div>
</div>

  );
};

export default PrivacyPolicy;
