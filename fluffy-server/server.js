const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product.router');

// Cấu hình biến môi trường
dotenv.config();

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware - đặt trước middleware khác để ghi lại tất cả requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// CORS và body parsing middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
try {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fluffy_store')
    .then(() => console.log('MongoDB kết nối thành công'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));
} catch (error) {
  console.error('Lỗi cấu hình MongoDB:', error);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/products', productRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.send('Fluffy API đang hoạt động');
});

// Test route để kiểm tra POST requests
app.post('/test', (req, res) => {
  console.log('Test POST body:', req.body);
  res.json({ message: 'Test POST successful', body: req.body });
});

// 404 handler - đặt SAU tất cả các routes khác
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Lỗi server, vui lòng thử lại sau',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});