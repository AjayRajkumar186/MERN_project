import { useEffect, useState } from "react";
import {
  FiFileText,
  FiUser,
  FiCreditCard,
  FiTruck,
  FiRotateCcw,
  FiAward,
  FiAlertTriangle,
  FiSlash,
  FiRefreshCw,
  FiMail,
} from "react-icons/fi";

const sections = [
  {
    icon: FiFileText,
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using <span className="text-white/80 font-semibold">ShopMate</span>, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.
      </p>
    ),
  },
  {
    icon: FiUser,
    title: "User Accounts",
    content: (
      <p>
        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. ShopMate reserves the right to suspend or terminate accounts that violate these terms.
      </p>
    ),
  },
  {
    icon: FiCreditCard,
    title: "Orders & Payments",
    content: (
      <p>
        All orders placed through our platform are subject to product availability and payment confirmation. Prices are subject to change without notice.
      </p>
    ),
  },
  {
    icon: FiTruck,
    title: "Shipping & Delivery",
    content: (
      <p>
        Delivery timelines are estimated and may vary due to location, logistics, or unforeseen circumstances. ShopMate is not liable for delays beyond its control.
      </p>
    ),
  },
  {
    icon: FiRotateCcw,
    title: "Returns & Refunds",
    content: (
      <p>
        Returns and refunds are processed in accordance with our return policy. Items must be returned in unused condition and original packaging where applicable.
      </p>
    ),
  },
  {
    icon: FiAward,
    title: "Intellectual Property",
    content: (
      <p>
        All content, logos, images, and materials on ShopMate are the intellectual property of ShopMate and may not be copied, reproduced, or distributed without written permission.
      </p>
    ),
  },
  {
    icon: FiSlash,
    title: "Prohibited Activities",
    content: (
      <p>
        Users must not misuse the website, attempt unauthorized access, introduce harmful code, or engage in any activity that disrupts our services.
      </p>
    ),
  },
  {
    icon: FiAlertTriangle,
    title: "Limitation of Liability",
    content: (
      <p>
        ShopMate shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services.
      </p>
    ),
  },
  {
    icon: FiRefreshCw,
    title: "Changes to Terms",
    content: (
      <p>
        We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on this page.
      </p>
    ),
  },
  {
    icon: FiMail,
    title: "Contact Information",
    content: (
      <p>
        If you have any questions about these Terms & Conditions, please contact us at{" "}
        <span className="text-indigo-400 font-medium">support@shopmate.com</span>.
      </p>
    ),
  },
];

const TermsAndConditions = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080a0f] py-14 px-4 overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-15 -right-20 w-80 h-80 bg-violet-600 rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />
      <div className="absolute -bottom-10 -left-15 w-72 h-72 bg-indigo-500 rounded-full blur-[110px] opacity-[0.08] pointer-events-none" />

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
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-5">
            <FiFileText size={20} className="text-violet-400" />
          </div>
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-violet-400 mb-2">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-white/30">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className={`group bg-white/3 border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:bg-white/4.5 hover:border-violet-500/20 transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${80 + idx * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon badge */}
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mt-0.5 group-hover:bg-violet-500/15 transition-colors duration-200">
                    <Icon size={13} className="text-violet-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-bold text-violet-400/50 tracking-widest">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors duration-200">
                        {section.title}
                      </h2>
                    </div>
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
            By using ShopMate, you agree to these Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;