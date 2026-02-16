const User = require('../models/User');
const Cleaner = require('../models/Cleaner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, area, phone } = req.body;

        // Validation
        if (!name || !email || !password || !area || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            area,
            phone,
            role: 'user'
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                area: user.area,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        let user;

        // Check role and find user
        if (role === 'cleaner') {
            user = await Cleaner.findOne({ email }).select('+password');
        } else {
            user = await User.findOne({ email }).select('+password');
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                area: user.area || user.assignedArea,
                phone: user.phone,
                vehicleNumber: user.vehicleNumber || null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Register cleaner
// @route   POST /api/auth/register-cleaner
// @access  Public
exports.registerCleaner = async (req, res) => {
    try {
        const { name, email, password, phone, vehicleNumber, assignedArea } = req.body;

        // Validation
        if (!name || !email || !password || !phone || !vehicleNumber || !assignedArea) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields'
            });
        }

        // Check if cleaner exists
        const cleanerExists = await Cleaner.findOne({ email });
        if (cleanerExists) {
            return res.status(400).json({
                success: false,
                message: 'Cleaner already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create cleaner
        const cleaner = await Cleaner.create({
            name,
            email,
            password: hashedPassword,
            phone,
            vehicleNumber,
            assignedArea,
            role: 'cleaner'
        });

        // Generate token
        const token = generateToken(cleaner._id, cleaner.role);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: cleaner._id,
                name: cleaner.name,
                email: cleaner.email,
                phone: cleaner.phone,
                vehicleNumber: cleaner.vehicleNumber,
                assignedArea: cleaner.assignedArea,
                role: cleaner.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check admin credentials from env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });

            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: 'admin',
                    name: 'Admin',
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                }
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid admin credentials'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
