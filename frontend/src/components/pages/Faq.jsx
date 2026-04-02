import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[#080a0f] py-14 px-4 overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-15 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500 rounded-full blur-[110px] opacity-[0.1] pointer-events-none" />
      <div className="absolute -bottom-15 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-violet-600 rounded-full blur-[100px] opacity-[0.1] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-3">
            Help Center
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-white/35">
            Find answers to common questions about orders, payments, and delivery.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`group relative bg-white/3 border rounded-2xl overflow-hidden transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } ${
                  isOpen
                    ? "border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                    : "border-white/[0.07] hover:border-white/13"
                }`}
                style={{ transitionDelay: `${100 + index * 70}ms` }}
              >
                {/* Active top accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Question button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-5 sm:px-6 py-4 sm:py-5 text-left gap-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Number badge */}
                    <span
                      className={`shrink-0 w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          : "bg-white/5 text-white/25 border border-white/[0.07]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                        isOpen ? "text-white" : "text-white/65 group-hover:text-white/85"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <FiChevronDown
                    size={16}
                    className={`shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 text-indigo-400"
                        : "text-white/25 group-hover:text-white/45"
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 sm:px-6 pb-5">
                    <div className="h-px bg-white/5 mb-4" />
                    <p className="text-sm text-white/45 leading-relaxed pl-9">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Faq;