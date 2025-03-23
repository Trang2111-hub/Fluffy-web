// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes auth
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/me', authController.getMe);
router.get('/check-token', authController.checkToken);
router.post('/change-password', authController.changePassword);
router.put('/update-profile', authController.updateProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/social-login', authController.socialLogin);

module.exports = router;