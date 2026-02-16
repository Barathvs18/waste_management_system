const express = require('express');
const router = express.Router();
const {
    createRoute,
    getAllRoutes,
    getMyRoutes,
    updateRouteStatus,
    deleteRoute
} = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/auth');

// Cleaner routes
router.get('/my-routes', protect, authorize('cleaner'), getMyRoutes);
router.put('/:id/status', protect, authorize('cleaner'), updateRouteStatus);

// Admin routes
router.post('/', protect, authorize('admin'), createRoute);
router.get('/', protect, authorize('admin'), getAllRoutes);
router.delete('/:id', protect, authorize('admin'), deleteRoute);

module.exports = router;
