import { useEffect, useState } from "react";
import { FiShield, FiLock, FiEye, FiShare2, FiDatabase, FiCpu, FiUser, FiRefreshCw, FiMail } from "react-icons/fi";

const sections = [
  {
    icon: FiEye,
    title: "Introduction",
    content: (
      <p>
        Welcome to <span className="text-white/80 font-semibold">ShopMate</span>. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website or services.
      </p>
    ),
  },
  {
    icon: FiDatabase,
    title: "Information We Collect",
    content: (
      <ul className="space-y-2">
        {[
          "Personal details such as name, email, phone number, and address",
          "Order and payment-related information",
          "Device, browser, and usage data",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400/60 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: FiCpu,
    title: "How We Use Your Information",
    content: (
      <ul className="space-y-2">
        {[
          "To process orders and deliver products",
          "To communicate order updates and support requests",
          "To improve our website, services, and user experience",
          "To comply with legal obligations",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400/60 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: FiShare2,
    title: "Sharing of Information",
    content: (
      <p>
        We do not sell or rent your personal data. Information may be shared only with trusted partners such as payment gateways and delivery services, strictly for order fulfillment.
      </p>
    ),
  },
  {
    icon: FiLock,
    title: "Data Security",
    content: (
      <p>
        We implement appropriate security measures to protect your personal data from unauthorized access, misuse, or disclosure. However, no method of transmission over the internet is 100% secure.
      </p>
    ),
  },
  {
    icon: FiCpu,
    title: "Cookies",
    content: (
      <p>
        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
      </p>
    ),
  },
  {
    icon: FiUser,
    title: "Your Rights",
    content: (
      <p>
        You have the right to access, update, or delete your personal information. If you have concerns about your data, please contact our support team.
      </p>
    ),
  },
  {
    icon: FiRefreshCw,
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
      </p>
    ),
  },
  {
    icon: FiMail,
    title: "Contact Us",
    content: (
      <p>
        If you have any questions about this Privacy Policy, you can reach us at{" "}
        <span className="text-indigo-400 font-medium">support@shopmate.com</span>.
      </p>
    ),
  },
];

const PrivacyPolicy = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080a0f] py-14 px-4 overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-15 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />
      <div className="absolute -bottom-10 -right-15 w-72 h-72 bg-violet-600 rounded-full blur-[110px] opacity-[0.08] pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Header */}
        <div
          className={`mb-10 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-5">
            <FiShield size={20} className="text-indigo-400" />
          </div>
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-2">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/30">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className={`group bg-white/3 border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:bg-white/4.5 hover:border-indigo-500/20 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${80 + idx * 55}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon badge */}
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mt-0.5 group-hover:bg-indigo-500/15 transition-colors duration-200">
                    <Icon size={13} className="text-indigo-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Section number + title */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-bold text-indigo-400/50 tracking-widest">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors duration-200">
                        {section.title}
                      </h2>
                    </div>

                    {/* Content */}
                    <div className="text-sm text-white/40 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-xs text-white/20">
            By using ShopMate, you agree to this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;