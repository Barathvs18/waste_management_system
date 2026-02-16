const express = require('express');
const router = express.Router();
const {
    getAllCleaners,
    getCleanerProfile,
    updateCleanerStatus,
    updateCleanerArea,
    deleteCleaner
} = require('../controllers/cleanerController');
const { protect, authorize } = require('../middleware/auth');

// Cleaner routes
router.get('/profile', protect, authorize('cleaner'), getCleanerProfile);
router.put('/status', protect, authorize('cleaner'), updateCleanerStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllCleaners);
router.put('/:id/area', protect, authorize('admin'), updateCleanerArea);
router.delete('/:id', protect, authorize('admin'), deleteCleaner);

module.exports = router;
