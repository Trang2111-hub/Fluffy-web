require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const Product = require('./models/Product.js');


app.use(cors());
app.use(express.json());

try {
  const db = require('./config/db');
  db.connect()
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('MongoDB connection error:', error));
} catch (error) {
  console.error('MongoDB configuration error:', error);
}


const productRouter = require('./routes/product.router');
app.use('/products', productRouter);

app.post('/products/cart-products', async (req, res) => {
  try {
    console.log('Received body:', req.body);
    let { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      console.error('Lỗi: Dữ liệu productIds không hợp lệ:', productIds);
      return res.status(400).json({ message: 'Danh sách ID không hợp lệ hoặc trống' });
    }
    const numericIds = productIds.map(id => Number(id)).filter(id => !isNaN(id));
    if (numericIds.length === 0) {
      return res.status(400).json({ message: 'Không có ID hợp lệ nào' });
    }
    const products = await Product.find({ product_id: { $in: numericIds } });
    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

app.get('/', (req, res) => {
    console.log('Root route accessed')
    res.send('Fluffy Store API is running')
})

// 404 handler
app.use((req, res, next) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`)
    res.status(404).json({ message: 'Route not found' })
})

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err)
    res.status(500).json({ 
        message: 'Internal Server Error', 
        error: err.message,
        path: req.url
    })
})

// Handle process termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed through app termination')
        process.exit(0)
    })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to uncaught exception')
        process.exit(1)
    })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason)
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to unhandled promise rejection')
        process.exit(1)
    })
})

