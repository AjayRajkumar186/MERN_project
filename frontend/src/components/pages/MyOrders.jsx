import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiShield,
  FiCalendar,
  FiHash,
  FiArrowLeft,
  FiArrowRight,
  FiShoppingBag,
  FiExternalLink,
} from "react-icons/fi";
import orderService from "../services/order";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [mounted, setMounted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const getPagination = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) rangeWithDots.push("...");
    if (pages > 0) rangeWithDots.unshift(1);
    rangeWithDots.push(...range);
    if (page + delta < pages - 1) rangeWithDots.push("...");
    if (pages > 1) rangeWithDots.push(pages);
    return rangeWithDots;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      if (!user) { navigate("/login"); return; }
      setLoading(true);
      setMounted(false);
      try {
        const res = await orderService.getMyOrders({ page, limit: 5 });
        if (isMounted) {
          setOrders(res.data?.orders || []);
          setPages(res.data?.pages || 1);
          requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
          setTimeout(() => setMounted(true), 50);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-white/30 tracking-widest uppercase">Loading orders</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0f]">

      {/* Blobs */}
      <div className="fixed top-0 -left-25 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-[0.07] pointer-events-none" />
      <div className="fixed bottom-0 -right-20 w-72 h-72 bg-violet-600 rounded-full blur-[100px] opacity-[0.07] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-10 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-1">
              {isAdmin ? "Admin Panel" : "Account"}
            </p>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {isAdmin ? "Order Management" : "My Orders"}
              </h1>
              {isAdmin && (
                <span className="flex items-center gap-1 bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 text-[9px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                  <FiShield size={10} /> Admin
                </span>
              )}
            </div>
            <p className="text-sm text-white/35">
              {isAdmin
                ? "Overview of all customer transactions."
                : "Review and track your recent orders."}
            </p>
          </div>

          <button
            onClick={() => navigate("/product")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
          >
            <FiShoppingBag size={14} /> Continue Shopping
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FiShoppingBag size={26} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">No orders found</p>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order, idx) => (
            <div
              key={order._id}
              className={`group bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden hover:bg-white/5 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Card top bar */}
              <div className={`px-5 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-white/6 ${
                isAdmin ? "bg-indigo-500/4" : "bg-white/2"
              }`}>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    order.user?.role === "admin"
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                      : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                  }`}>
                    {(isAdmin ? order.user?.username : user?.username)?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    {isAdmin && (
                      <p className={`text-[9px] font-bold uppercase tracking-[2px] mb-0.5 ${
                        order.user?.role === "admin" ? "text-rose-400" : "text-indigo-400"
                      }`}>
                        {order.user?.role === "admin" ? "Administrator" : "Customer"}
                        {order.user?.role === "admin" && (
                          <span className="ml-2 bg-rose-500/15 border border-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded text-[8px]">
                            Internal
                          </span>
                        )}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-white/85">
                      {isAdmin ? order.user?.username || "Unknown User" : user?.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/35">
                    <FiCalendar size={11} />
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </div>

                  {/* Status badge */}
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                    order.status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex flex-col lg:flex-row gap-6">

                  {/* Product images */}
                  <div className="flex gap-2.5 flex-wrap lg:max-w-45">
                    {order.items?.map((item) => (
                      <div key={item._id} className="relative">
                        <div className="w-16 h-16 rounded-xl bg-[#0d0f16] border border-white/6 overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_IMAGE_URL}${item.image}`}
                            alt="product"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                            className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#0d0f16] border border-white/10 text-white text-[9px] font-bold rounded-full">
                          {item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Transaction */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[2px] text-indigo-400 mb-3">
                        Transaction Summary
                      </p>
                      <div className="bg-white/3 border border-white/6 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-white/35">Order ID</span>
                          <span className="font-mono text-[10px] text-white/55">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-white/35">Total Paid</span>
                          <span className="text-base font-black text-indigo-400">
                            ₹{order.totalAmount?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[2px] text-indigo-400 mb-3">
                        Shipping Destination
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-xs text-white/55">
                          <FiUser size={11} className="text-white/25 shrink-0" />
                          <span className="font-medium text-white/75">{order.shipping?.name}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-white/55">
                          <FiPhone size={11} className="text-white/25 shrink-0" />
                          <span>{order.shipping?.phone}</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-white/55">
                          <FiMapPin size={11} className="text-white/25 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{order.shipping?.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[9px] text-white/20 font-mono">
                    <FiHash size={9} /> {order._id}
                  </div>
                  <button
                    onClick={() => navigate(`/product/description/${order.items[0]._id}`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/0 hover:bg-indigo-500/10 border border-indigo-500/0 hover:border-indigo-500/20 transition-all duration-200"
                  >
                    View Specs <FiExternalLink size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div
            className={`mt-12 flex justify-center transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center gap-1.5 p-1.5 bg-white/3 border border-white/[0.07] rounded-2xl">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiArrowLeft size={15} />
              </button>

              {getPagination().map((item, index) =>
                item === "..." ? (
                  <span key={index} className="w-9 h-9 flex items-center justify-center text-white/20 text-xs">
                    •••
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setPage(item)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                      page === item
                        ? "bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;