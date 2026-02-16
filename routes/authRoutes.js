const express = require('express');
const router = express.Router();
const {
    register,
    login,
    registerCleaner,
    adminLogin
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/register-cleaner', registerCleaner);
router.post('/admin-login', adminLogin);

module.exports = router;
