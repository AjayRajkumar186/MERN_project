const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
                name: String,
                price: Number,
                qty: Number,
                image: String,
            },
        ],

        shipping: {
            name: String,
            address: String,
            phone: String,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        paymentId: {
            type: String,
        },

        orderId: {
            type: String, // Razorpay order id
        },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

// Auto-delete orders 30 days after creation (TTL index)
orderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("Order", orderSchema);