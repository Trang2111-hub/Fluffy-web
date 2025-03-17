// Load environment variables
require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

// Cấu hình CORS
app.use(cors())

// Connect to MongoDB
try {
  const db = require('./config/db')
  db.connect()
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('MongoDB connection error:', error))
} catch (error) {
  console.error('MongoDB configuration error:', error)
}

// Routes
app.get('/', (req, res) => {
  res.send('Fluffy Store API is running')
})

// API lấy tất cả sản phẩm
app.get('/products', (req, res) => {
  mongoose.connection.db.collection('products').find({}).toArray()
    .then(products => {
      console.log(`Tìm thấy ${products.length} sản phẩm`);
      res.json(products);
    })
    .catch(err => {
      console.error('Lỗi khi lấy sản phẩm:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
