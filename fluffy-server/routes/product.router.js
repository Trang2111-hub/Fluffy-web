const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Middleware để log tất cả các requests
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Danh sách các routes cố định
const FIXED_ROUTES = ['/discounted', '/all', '/best-selling'];

// Middleware để xử lý các routes cố định trước
router.use((req, res, next) => {
    const path = req.path;
    if (FIXED_ROUTES.includes(path)) {
        console.log(`Handling fixed route: ${path}`);
        next('route');
    } else {
        next();
    }
});

// API gốc để kiểm tra router
router.get('/', (req, res) => {
    console.log('Accessing root product route');
    res.send('Product Router hoạt động tốt');
});

// API lấy tất cả sản phẩm
router.get('/all', async (req, res) => {
    console.log('Accessing /all route');
    try {
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log(`Tìm thấy ${products.length} sản phẩm`);
        res.json(products);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API lấy sản phẩm khuyến mãi
router.get('/discounted', async (req, res) => {
    console.log('Accessing /discounted route');
    try {
        console.log('Đang tìm sản phẩm khuyến mãi...');
        const discountedProducts = await mongoose.connection.db.collection('products')
            .find({
                'pricing.discount_percentage': { $exists: true, $gt: '0' }
            })
            .toArray();

        console.log('Kết quả tìm kiếm:', discountedProducts);

        if (!discountedProducts || discountedProducts.length === 0) {
            console.log('Không tìm thấy sản phẩm khuyến mãi');
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm khuyến mãi' });
        }

        console.log(`Tìm thấy ${discountedProducts.length} sản phẩm khuyến mãi`);
        res.json(discountedProducts);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm khuyến mãi:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy sản phẩm khuyến mãi' });
    }
});

// API lấy sản phẩm bán chạy
router.get('/best-selling', async (req, res) => {
    console.log('Accessing /best-selling route');
    try {
        console.log('Đang tìm sản phẩm bán chạy');
        const bestSellingProducts = await mongoose.connection.db.collection('products').find({ isBestSelling: true }).toArray();
        
        if (bestSellingProducts.length === 0) {
            console.log('Không tìm thấy sản phẩm bán chạy');
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm bán chạy' });
        }
        
        console.log('Tìm thấy sản phẩm bán chạy:', bestSellingProducts);
        res.json(bestSellingProducts);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm bán chạy:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API lấy sản phẩm theo bộ sưu tập
router.get('/collection/:collection', async (req, res) => {
    console.log('Accessing /collection route with param:', req.params.collection);
    try {
        const collection = req.params.collection;
        const products = await mongoose.connection.db.collection('products').find({ collection: collection }).toArray();
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào trong bộ sưu tập này' });
        }
        
        res.json(products);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm theo bộ sưu tập:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API lấy sản phẩm liên quan
router.get('/related/:productId', async (req, res) => {
    console.log('Accessing /related route with param:', req.params.productId);
    try {
        const productId = parseInt(req.params.productId);
        
        if (isNaN(productId)) {
            return res.status(400).json({ message: 'ID sản phẩm phải là số nguyên' });
        }
        
        const currentProduct = await mongoose.connection.db.collection('products').findOne({ product_id: productId });
        
        if (!currentProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        
        const relatedProducts = await mongoose.connection.db.collection('products').find({
            product_id: { $ne: productId },
            collection: currentProduct.collection
        }).limit(3).toArray();
        
        res.json(relatedProducts);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// API lấy sản phẩm theo product_id - Đặt cuối cùng vì đây là route có pattern chung nhất
router.get('/:productId', async (req, res) => {
    // Kiểm tra nếu path là một trong các routes cố định thì bỏ qua
    if (FIXED_ROUTES.includes(req.path)) {
        return next();
    }
    
    console.log('Accessing /:productId route');
    try {
        console.log('Nhận request với productId:', req.params.productId);
        const productId = parseInt(req.params.productId);
        
        if (isNaN(productId)) {
            console.log('ProductId không phải là số:', req.params.productId);
            return res.status(400).json({ message: 'ID sản phẩm phải là số nguyên' });
        }
        
        console.log('Đang tìm sản phẩm với product_id:', productId);
        const product = await mongoose.connection.db.collection('products').findOne({ product_id: productId });
        
        if (!product) {
            console.log('Không tìm thấy sản phẩm với product_id:', productId);
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        
        console.log('Tìm thấy sản phẩm:', product);
        res.json(product);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm theo product_id:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
