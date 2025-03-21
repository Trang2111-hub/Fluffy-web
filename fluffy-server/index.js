// Load environment variables
require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // Allow Angular dev server
    credentials: true
}))
app.use(express.json())

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// MongoDB connection with detailed error handling
console.log('Attempting to connect to MongoDB...')
mongoose.connect('mongodb://localhost:27017/fluffy_store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connection successful')
    // Only start the server after successful database connection
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    })
})
.catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
})

// Import routes
const productRouter = require('./routes/product.router')

// Mount router với prefix /products
app.use('/products', productRouter)

// Routes
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
