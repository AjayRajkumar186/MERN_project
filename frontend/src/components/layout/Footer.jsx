import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-12">
      
      {/* Top Accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-indigo-800 via-blue-400 to-blue-800 bg-clip-text text-transparent">ShopMate</h2>
          <p className="text-sm mt-4 leading-relaxed">
            Your one-stop shop for premium products, fast delivery, and unbeatable prices.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="https://www.facebook.com/" target="_blank" className="p-2 rounded-full bg-gray-800 hover:bg-indigo-600 text-white transition">
              <FaFacebookF size={14} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" className="p-2 rounded-full bg-gray-800 hover:bg-pink-600 text-white transition">
              <FaInstagram size={14} />
            </a>
            <a href="https://twitter.com/" target="_blank" className="p-2 rounded-full bg-gray-800 hover:bg-sky-500 text-white transition">
              <FaTwitter size={14} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 text-white transition">
              <FaLinkedinIn size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-800 via-blue-400 to-blue-800 bg-clip-text text-transparent">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-300 md:text-gray-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/product" className="hover:text-white">Products</Link></li>
            <li><Link to="/my-orders" className="hover:text-white">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-800 via-blue-400 to-blue-800 bg-clip-text text-transparent">Support</h3>
          <ul className="space-y-3 text-sm text-gray-300 md:text-gray-300">
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-800 via-blue-400 to-blue-800 bg-clip-text text-transparent">contact</h3>
          <ul className="space-y-4 text-sm text-gray-300 md:text-gray-300">
            <li className="flex items-center gap-3">
              <FiPhone className="text-indigo-500" />
              +91 86676 26797
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="text-indigo-500" />
              support@shopmate.com
            </li>
            <li className="flex items-center gap-3">
              <FiClock className="text-indigo-500" />
              Mon – Sat : 9:00 AM – 9:00 PM
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">ShopMate</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
