import api from "../services/api";

const orderService = {
  // ✅ Create Razorpay Order
  createOrder(amount) {
    return api.post("/orders/create-order", { amount });
  },

  // ✅ Verify Payment & Save Order
  verifyPayment(payload) {
    return api.post("/orders/verify-payment", payload);
  },

  // ✅ Get My Orders
  getMyOrders(query = {}) {
    const { page = 1, limit = 5 } = query;
    return api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
  },
};

export default orderService;