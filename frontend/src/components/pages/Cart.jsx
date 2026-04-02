import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart } = useCart();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <FiShoppingCart size={32} className="text-white/20" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white/60 mb-1">Your cart is empty</h2>
          <p className="text-sm text-white/30">Looks like you haven't added anything yet.</p>
        </div>
        <Link
          to="/product"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-200"
        >
          Continue Shopping <FiArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-1">Review</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemTotal = item.price * item.qty;

              return (
                <div
                  key={item._id}
                  className="group flex flex-col sm:flex-row items-center gap-4 bg-white/3 border border-white/[0.07] rounded-2xl p-4 hover:bg-white/5 hover:border-indigo-500/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-[#0d0f16] border border-white/6 flex items-center justify-center overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_IMAGE_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-white/85 leading-snug line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/35 mb-3">
                      {item.qty} × ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={item.qty === 1}
                        onClick={() => decreaseQty(item.id)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-all duration-200
                          ${item.qty === 1
                            ? "border-white/5 text-white/15 cursor-not-allowed"
                            : "border-white/10 text-white/50 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/10"
                          }`}
                      >
                        <FiMinus size={13} />
                      </button>

                      <span className="w-9 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
                      >
                        <FiPlus size={13} />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/15 text-red-400/50 hover:border-red-500/35 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="shrink-0 hidden sm:flex flex-col items-end">
                    <p className="text-xs text-white/30 mb-0.5">Item total</p>
                    <p className="text-base font-bold text-white">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="relative bg-white/3 border border-white/[0.07] rounded-2xl p-6 top-24">

              {/* Top accent */}
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent rounded-full" />

              <p className="text-[10px] font-medium tracking-[3px] uppercase text-indigo-400 mb-1">Breakdown</p>
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/45">Total Products</span>
                  <span className="text-sm font-medium text-white/75">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/45">Total Quantity</span>
                  <span className="text-sm font-medium text-white/75">{totalQty}</span>
                </div>

                <div className="h-px bg-white/6 my-1" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Total Amount</span>
                  <span className="text-lg font-black text-indigo-400">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Proceed to Checkout <FiArrowRight size={15} />
              </button>

              <Link
                to="/product"
                className="block text-center mt-4 text-xs text-indigo-400/70 hover:text-indigo-400 transition-colors duration-200"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;