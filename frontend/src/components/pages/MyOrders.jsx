import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiShield,
  FiCalendar,
  FiHash,
} from "react-icons/fi";
import orderService from "../services/order";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const getPagination = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pages - 1, page + delta);
      i++
    ) {
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
      if (!user) {
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const res = await orderService.getMyOrders({ page, limit: 5 });
        if (isMounted) {
          setOrders(res.data?.orders || []);
          setPages(res.data?.pages || 1);
          requestAnimationFrame(() =>
            window.scrollTo({ top: 0, behavior: "smooth" }),
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, [page]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white font-medium">
        Loading orders...
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 dark:bg-gray-900">
      {/* Header - Role Identification */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">
              {isAdmin ? "Order Management" : "My Purchase History"}
            </h2>
            {isAdmin && (
              <span className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider shadow-sm">
                <FiShield size={12} /> Admin Mode
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isAdmin
              ? "Overview of all customer transactions and delivery status."
              : "Review and track your recent orders."}
          </p>
        </div>

        <button
          onClick={() => navigate("/product")}
          className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none font-semibold text-sm"
        >
          Continue Shopping
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
              isAdmin
                ? "bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-900/50 shadow-xl shadow-indigo-50/50 dark:shadow-none"
                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
            }`}
          >
            {/* Top Bar - Admin Specific Info */}
            <div
              className={`p-5 flex flex-wrap justify-between items-center gap-4 ${isAdmin ? "bg-indigo-50/50 dark:bg-indigo-900/20" : "bg-gray-50/50 dark:bg-gray-800/50"}`}
            >
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  {/* Dynamic Label based on Role */}
                  {isAdmin && (
                  <div className="flex items-center gap-2">
                    
                      
                   
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.15em] ${
                        order.user?.role === "admin"
                          ? "text-rose-500 dark:text-rose-400"
                          : "text-indigo-500"
                      }`}
                    >
                      {order.user?.role === "admin"
                        ? "Administrator"
                        : "Customer"}
                    </span>

                    {/* Subtle Badge for Admin Role */}
                    {isAdmin && order.user?.role === "admin" && (
                      <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[9px] px-1.5 py-0.5 rounded-md font-bold border border-rose-200 dark:border-rose-800">
                        Internal Order
                      </span>
                    )}
                    
                  </div>
                  )}

                  {/* Name Display */}
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiUser
                      className={`${order.user?.role === "admin" ? "text-rose-500" : "text-indigo-500"}`}
                    />
                    <span className="truncate">
                      {isAdmin
                        ? order.user?.username || "Unknown User"
                        : user?.username}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Ordered On
                  </p>
                  <p className="text-sm font-medium dark:text-gray-200 flex items-center gap-1">
                    <FiCalendar className="text-gray-400" />{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border ${
                    order.status === "Paid"
                      ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800"
                      : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800"
                  }`}
                >
                  {order.status}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Image Gallery */}
                <div className="flex gap-3 flex-wrap max-w-xs">
                  {order.items?.map((item) => (
                    <div
                      key={item._id}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={`${import.meta.env.VITE_IMAGE_URL}${item.image}`}
                        alt="product"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                        className="w-20 h-20 object-cover rounded-2xl border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[10px] px-1.5 rounded-lg font-bold">
                        x{item.qty}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Details Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Summary */}
                  <div className="space-y-4">
                    <h4 className="text-[14px] font-black text-indigo-500 uppercase tracking-widest">
                      Transaction Summary
                    </h4>
                    <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-mono text-xs dark:text-gray-300">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
                        <span className="text-gray-500 font-medium text-sm">
                          Total Paid
                        </span>
                        <span className="text-xl font-black text-gray-900 dark:text-white">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="space-y-4">
                    <h4 className="text-[14px] font-black text-indigo-500 uppercase  tracking-widest">
                      Shipping Destination
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-start gap-3">
                        <FiUser className="mt-1 shrink-0 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-200">
                          {order.shipping?.name}
                        </span>
                      </p>
                      <p className="flex items-start gap-3">
                        <FiPhone className="mt-1 shrink-0 text-gray-400" />
                        <span>{order.shipping?.phone}</span>
                      </p>
                      <p className="flex items-start gap-3 leading-relaxed">
                        <FiMapPin className="mt-1 shrink-0 text-gray-400" />
                        <span>{order.shipping?.address}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                  <FiHash /> {order._id}
                </div>
                <button
                  onClick={() =>
                    navigate(`/product/description/${order.items[0]._id}`)
                  }
                  className="px-5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                >
                  View Full Specs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination UI */}
      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
          >
            <FiArrowLeft size={20} className="dark:text-white" />
          </button>

          {getPagination().map((item, index) =>
            item === "..." ? (
              <span key={index} className="px-2 text-gray-400">
                •••
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(item)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  page === item
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
          >
            <FiArrowRight size={20} className="dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
