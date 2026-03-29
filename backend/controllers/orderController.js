const Razorpay = require("razorpay");
const Order = require("../models/order");

let razorpay;

const getRazorpay = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
            throw new Error('RAZORPAY_KEY and RAZORPAY_SECRET must be set in .env');
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET,
        });
    }
    return razorpay;
};


// ✅ Create Razorpay Order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await getRazorpay().orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ Verify Payment + Save Order
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            items,
            shipping,
            totalAmount,
        } = req.body;

        // ⚠️ In production verify signature also (important)

        const newOrder = await Order.create({
            user: req.user.id,
            items,
            shipping,
            totalAmount,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: "Paid",
        });

        res.status(201).json({
            success: true,
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ Get Orders
exports.getMyOrders = async (req, res) => {
    try {
        let query = {};

        if (req.user.role !== "admin") {
            query.user = req.user.id;
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate('user', 'username email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};