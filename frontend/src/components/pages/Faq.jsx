import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, add items to your cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, UPI, net banking, and popular wallets. Cash on Delivery is also available for selected locations.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–7 business days, depending on your location and product availability.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Yes, you can cancel or modify your order before it is shipped. Go to 'My Orders' and select the order you want to update.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer an easy 7-day return policy for most products. The item must be unused and in its original packaging.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
  <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-14 px-4">
  <div className="max-w-4xl mx-auto">

    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-3">
        Find answers to common questions about orders, payments, and delivery.
      </p>
    </div>

    {/* FAQ List */}
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     rounded-xl shadow-sm"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex justify-between items-center px-6 py-5 text-left"
          >
            <span className="font-medium text-gray-900 dark:text-white">
              {faq.question}
            </span>

            <FiChevronDown
              className={`text-xl transition-transform duration-300
                ${
                  openIndex === index
                    ? "rotate-180 text-indigo-600"
                    : "text-gray-500 dark:text-gray-400"
                }`}
            />
          </button>

          {openIndex === index && (
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>

  </div>
</div>

  );
};

export default Faq;
