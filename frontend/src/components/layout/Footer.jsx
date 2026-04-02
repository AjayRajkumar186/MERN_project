import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#080a0f] border-t border-white/6 mt-12">

      {/* Top accent line */}
      <div className="h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <img src="/logo.png" alt="ShopMate" className="w-5 h-5 object-contain" onError={(e) => e.target.style.display = "none"} />
            </div>
            <span className="text-lg font-black tracking-tight bg-linear-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              ShopMate
            </span>
          </div>
          <p className="text-sm text-white/30 leading-relaxed">
            Your one-stop shop for premium products, fast delivery, and unbeatable prices.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5 mt-6">
            {[
              { href: "https://www.facebook.com/", icon: FaFacebookF, hover: "hover:bg-blue-600/80 hover:border-blue-500/40" },
              { href: "https://www.instagram.com/", icon: FaInstagram, hover: "hover:bg-pink-600/80 hover:border-pink-500/40" },
              { href: "https://twitter.com/", icon: FaTwitter, hover: "hover:bg-sky-500/80 hover:border-sky-400/40" },
              { href: "https://www.linkedin.com/", icon: FaLinkedinIn, hover: "hover:bg-blue-700/80 hover:border-blue-600/40" },
            ].map(({ href, icon: Icon, hover }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/[0.07] text-white/40 hover:text-white ${hover} transition-all duration-200`}
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-indigo-400 mb-5">
            Quick Links
          </p>
          <ul className="space-y-3">
            {[
              { to: "/", label: "Home" },
              { to: "/product", label: "Products" },
              { to: "/my-orders", label: "My Orders" },
              { to: "/cart", label: "Cart" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-white/35 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-indigo-400 mb-5">
            Support
          </p>
          <ul className="space-y-3">
            {[
              { to: "/contact", label: "Contact Us" },
              { to: "/faq", label: "FAQ" },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms & Conditions" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-white/35 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-indigo-400 mb-5">
            Contact
          </p>
          <ul className="space-y-4">
            {[
              { icon: FiPhone, text: "+91 86676 26797" },
              { icon: FiMail, text: "support@shopmate.com" },
              { icon: FiClock, text: "Mon – Sat : 9:00 AM – 9:00 PM" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 group">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-500/20 transition-colors duration-200">
                  <Icon size={12} className="text-indigo-400" />
                </span>
                <span className="text-sm text-white/35 leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5 px-4">
        <p className="text-center text-sm text-white/20">
          © {new Date().getFullYear()}{" "}
          <span className="text-white/50 font-semibold">ShopMate</span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;