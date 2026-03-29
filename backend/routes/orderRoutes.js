const express = require("express");
const router = express.Router();

const {
    createOrder,
    verifyPayment,
    getMyOrders,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my-orders", protect, getMyOrders);

module.exports = router;