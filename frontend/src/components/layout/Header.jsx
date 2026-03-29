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
  FiBell
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
// REMOVED: useNotifications import
import { notificationService } from "../services/notification"; // ✅ Added direct service import

const Header = ({ selectedCategory, setSelectedCategory }) => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState(null); 
  const [unreadCount, setUnreadCount] = useState(0); // ✅ Local state for count

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { cart } = useCart();
  const navigate = useNavigate();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const firstLetter = user?.username?.charAt(0)?.toUpperCase();

  // ✅ Fetch unread notifications count via API
 useEffect(() => {
  const fetchUnreadCount = async () => {
    try {
      if (user?.role === "admin") {
        const data = await notificationService.getNotifications();
        if (data && data.notifications) {
          const count = data.notifications.filter(n => !n.read).length;
          setUnreadCount(count);
        }
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  fetchUnreadCount();

  // ✅ LISTEN FOR THE CUSTOM EVENT
  window.addEventListener("notificationCreated", fetchUnreadCount);
  
  // Also refresh on an interval as a backup
  const interval = setInterval(fetchUnreadCount, 60000);

  return () => {
    // Cleanup listeners
    window.removeEventListener("notificationCreated", fetchUnreadCount);
    clearInterval(interval);
  };
}, [user]);
  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Scroll effect for mobile search bar
  useEffect(() => {
    const handleScroll = () => {
      setShowMobileSearch(window.scrollY < 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dark mode setup
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

  // ✅ Logout using localStorage
  const handleLogout = () => {
    localStorage.clear();
    // Reset local component states
    setUser(null);
    setShowProfile(false);
    // Redirect to login page
    navigate("/login"); 
  };
  
  const handleCategorySelect = (name) => {
    setSelectedCategory(name);
    setOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white shadow sticky top-0 z-50">
      {/* Header top */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-3xl font-extrabold
             bg-linear-to-r from-indigo-800 via-blue-400 to-blue-800
             bg-clip-text text-transparent"
        >
          <img
            src="/logo.png"
            alt="ShopMate Logo"
            className="w-9 h-9 md:w-10 md:h-10 object-contain"
          />
          ShopMate
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 mx-6 max-w-xl items-center relative">
          <FiSearch className="absolute left-3 text-indigo-600" />
          <input
            type="text"
            placeholder="Search products, brands and more"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              navigate(`/product?search=${value}`, { replace: true });
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg
               bg-indigo-50 dark:bg-indigo-900/30
               text-indigo-900 dark:text-indigo-100
               border-none outline-none
               focus:outline-none 
               transition-all duration-200"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/product" className="flex items-center gap-1 font-semibold hover:text-indigo-600">
            <FiBox /> Products
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/add-product"
              className="flex items-center gap-1 text-green-600 font-semibold"
            >
              <FiPlus /> Add Product
            </Link>
          )}

          <Link to="/my-orders" className="font-semibold hover:text-indigo-600">
            My Orders
          </Link>

          {/* Admin Notifications - Now using local unreadCount */}
          {user?.role === "admin" && (
            <button
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <FiBell size={22} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                        px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FiShoppingCart size={22} />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          {/* Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold"
              >
                {firstLetter}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                  <div className="px-4 py-2 text-sm text-gray-600">{user.username}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-4 py-1 border rounded">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/cart" className="relative">
            <FiShoppingCart size={24} />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>

          {user?.role === "admin" && (
            <button
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <FiBell size={22} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                        px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          <button onClick={() => setOpen(!open)}>
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 w-full origin-top overflow-hidden transition-transform duration-300 z-40
    ${showMobileSearch ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}
      >
        <div className="bg-white dark:bg-gray-900 px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  navigate(`/product?search=${value}`, { replace: true });
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg
            bg-indigo-50 dark:bg-indigo-900/30
            text-indigo-900 dark:text-indigo-100
            outline-none"
              />
            </div>
          </div>
        </div>
      </div>


      {/* MOBILE MENU */}
      {open && (
        <div
          className="md:hidden absolute top-full right-0 mt-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 divide-y dark:divide-gray-700 z-50 overflow-hidden"
          ref={mobileMenuRef}
        >
            {/* All Products */}
            <Link
              to="/product"
              onClick={() => handleCategorySelect("All")}
              className="flex items-center gap-4 w-full px-4 py-3 hover:bg-indigo-50 transition"
            >
              <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FiBox />
              </span>
              <span className="font-medium">All Products</span>
            </Link>

            {/* Orders */}
            <Link
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-indigo-50 transition"
            >
              <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FiShoppingBag />
              </span>
              <span className="font-medium">My Orders</span>
            </Link>


            {/* Admin */}
            {user?.role === "admin" && (
              <Link
                to="/add-product"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-green-50 transition"
              >
                <span className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <FiPlus />
                </span>
                <span className="font-medium text-green-700">Add Product</span>
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 transition w-full"
              >
                <span className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <FiLogOut />
                </span>
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-4 px-4 py-3 hover:bg-indigo-50 transition"
              >
                <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FiUser />
                </span>
                <span className="font-medium">Login</span>
              </Link>
            )}
        </div>
      )}
    </header>
  );
};

export default Header;