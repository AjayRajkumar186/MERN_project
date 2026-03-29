require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRouters');
const authRouter = require('./routes/authSignupRouter');
const authLoginRouter = require('./routes/authLoginRouter');
const categoryRouter = require('./routes/categoryRouter');
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const rateLimit = require('express-rate-limit');


connectDB();

const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to connect frontend to backend communication
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many login attempts from this IP, please try again after 5 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 signup requests per windowMs
  message: { message: 'Too many accounts created from this IP, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API Routes
app.use('/auth/signup', signupLimiter, authRouter, loginLimiter);
app.use('/auth/login', loginLimiter, authLoginRouter);
app.use('/category', categoryRouter, loginLimiter);
app.use('/products', productRoutes, loginLimiter);
app.use("/orders", orderRoutes, loginLimiter);
app.use("/banners", bannerRoutes, loginLimiter);
app.use("/notifications", notificationRoutes, loginLimiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 

// 404 Not Found middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

