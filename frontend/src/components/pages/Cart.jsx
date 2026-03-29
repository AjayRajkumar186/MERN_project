import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from "react-icons/fi";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart } = useCart();

  // Total amount & quantity
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3  dark:text-white text-gray-500">
          <FiShoppingCart size={32} />
          <span>Your cart is empty</span>
        </h2>
        <Link
          to="/product"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className=" dark:bg-gray-900 dark:text-white container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-5">
          {cart.map((item) => {
            const itemTotal = item.price * item.qty;

            return (
              <div
                key={item._id}
                className=" dark:bg-gray-900 dark:text-white  flex flex-col sm:flex-row items-center gap-5 border p-4 rounded-lg shadow-sm hover:shadow-lg transition"
              >
                {/* Product Image */}
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}${item.image}`}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded"
                />

                {/* Product Details */}
                <div className="flex-1 w-full ">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 mb-2">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")} ({item.qty} × ₹{item.price.toLocaleString("en-IN")})
                  </p>


                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      disabled={item.qty === 1}
                      onClick={() => decreaseQty(item.id)}
                      className={`p-2 border rounded transition ${item.qty === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
                        }`}
                    >
                      <FiMinus />
                    </button>

                    <span className="px-4 py-1 border rounded font-semibold">{item.qty}</span>

                    <button
                      onClick={() => addToCart(item)}
                      className="p-2 border rounded hover:bg-gray-100 transition"
                    >
                      <FiPlus />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-600 hover:text-red-700 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-lg font-bold mt-4 sm:mt-0 hidden sm:block">
                  ₹{itemTotal.toLocaleString("en-IN")}
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="border dark:bg-gray-900 dark:text-white rounded-lg p-6 h-fit shadow-sm bg-white">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Total Products</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Total Quantity</span>
            <span>{totalQty}</span>
          </div>

          <div className="flex justify-between mb-4 text-lg font-bold text-indigo-600">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </button>


          <Link
            to="/product"
            className="block text-center mt-4 text-indigo-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div >
  );
};

export default Cart;
