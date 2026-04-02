import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiBox,
  FiPlus,
  FiLogOut,
  FiSearch,
  FiShoppingBag,
  FiMoon,
  FiSun,
  FiBell,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { notificationService } from "../services/notification";

const Header = ({ selectedCategory, setSelectedCategory }) => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { cart } = useCart();
  const navigate = useNavigate();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const firstLetter = user?.username?.charAt(0)?.toUpperCase();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        if (user?.role === "admin") {
          const data = await notificationService.getNotifications();
          if (data && data.notifications) {
            const count = data.notifications.filter((n) => !n.read).length;
            setUnreadCount(count);
          }
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
    fetchUnreadCount();
    window.addEventListener("notificationCreated", fetchUnreadCount);
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => {
      window.removeEventListener("notificationCreated", fetchUnreadCount);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowMobileSearch(window.scrollY < 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setShowProfile(false);
    navigate("/login");
  };

  const handleCategorySelect = (name) => {
    setSelectedCategory(name);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080a0f]/90 backdrop-blur-xl border-b border-white/6 shadow-lg shadow-black/30">

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/60 to-transparent" />

      {/* Main row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
            <img
              src="/logo.png"
              alt="ShopMate Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tight bg-linear-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            ShopMate
          </span>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 mx-4 max-w-xl relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm" />
          <input
            type="text"
            placeholder="Search products, brands and more..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              navigate(`/product?search=${value}`, { replace: true });
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 outline-none transition-all duration-300 focus:bg-indigo-500/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            to="/product"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <FiBox size={15} /> Products
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/add-product"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200"
            >
              <FiPlus size={15} /> Add Product
            </Link>
          )}

          <Link
            to="/my-orders"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            My Orders
          </Link>

          {/* Notifications (admin only) */}
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <FiShoppingCart size={18} />
            {totalQty > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {totalQty}
              </span>
            )}
          </Link>
          

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Profile / Login */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white text-sm font-bold flex items-center justify-center shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200"
              >
                {firstLetter}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/6">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{user.username}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile right actions */}
        <div className="md:hidden flex items-center gap-3 ml-auto">
          <Link to="/cart" className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
            <FiShoppingCart size={20} />
            {totalQty > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {totalQty}
              </span>
            )}
          </Link>

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          )}


          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          showMobileSearch ? "max-h-16 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pb-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                navigate(`/product?search=${value}`, { replace: true });
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 outline-none transition-all duration-300 focus:bg-indigo-500/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-[#0d0f16]/95 backdrop-blur-xl border-t border-white/6 shadow-2xl shadow-black/50 z-50 overflow-hidden"
        >
          <div className="px-3 py-2 space-y-0.5">

            <Link
              to="/product"
              onClick={() => handleCategorySelect("All")}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
            >
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-200">
                <FiBox size={15} />
              </span>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200">
                All Products
              </span>
            </Link>

            <Link
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
            >
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-200">
                <FiShoppingBag size={15} />
              </span>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200">
                My Orders
              </span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/add-product"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-500/5 transition-all duration-200 group"
              >
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-200">
                  <FiPlus size={15} />
                </span>
                <span className="text-sm font-medium text-emerald-400/80 group-hover:text-emerald-300 transition-colors duration-200">
                  Add Product
                </span>
              </Link>
            )}

            <div className="h-px bg-white/6 mx-1 my-1" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center">
                    {firstLetter}
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest leading-none mb-0.5">Signed in as</p>
                    <p className="text-sm font-medium text-white">{user.username}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 transition-all duration-200 group"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-200">
                    <FiLogOut size={15} />
                  </span>
                  <span className="text-sm font-medium text-red-400/80 group-hover:text-red-300 transition-colors duration-200">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-200">
                  <FiUser size={15} />
                </span>
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200">
                  Login
                </span>
              </Link>
            )}
          </div>

          <div className="pb-2" />
        </div>
      )}
    </header>
  );
};

export default Header;