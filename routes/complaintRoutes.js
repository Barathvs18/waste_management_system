const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    getCleanerComplaints,
    assignComplaint,
    updateComplaintStatus,
    getAnalytics
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.post('/', protect, authorize('user'), createComplaint);
router.get('/my-complaints', protect, authorize('user'), getMyComplaints);

// Cleaner routes
router.get('/cleaner-complaints', protect, authorize('cleaner'), getCleanerComplaints);
router.put('/:id/status', protect, authorize('cleaner'), updateComplaintStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllComplaints);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
