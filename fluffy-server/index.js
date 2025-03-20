// Load environment variables
require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
try {
  const db = require('./config/db')
  db.connect()
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('MongoDB connection error:', error))
} catch (error) {
  console.error('MongoDB configuration error:', error)
}

// Import routes
const productRouter = require('./routes/product.router')

// Mount router với prefix /products
app.use('/products', productRouter)

// Routes
app.get('/', (req, res) => {
  res.send('Fluffy Store API is running')
})

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
