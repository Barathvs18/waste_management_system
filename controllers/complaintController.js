const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Cleaner = require('../models/Cleaner');

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res) => {
    try {
        const { description } = req.body;

        const user = await User.findById(req.user._id);

        const complaint = await Complaint.create({
            userId: req.user._id,
            userEmail: user.email,
            userName: user.name,
            area: user.area,
            description: description || 'Waste Not Collected'
        });

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/my-complaints
// @access  Private (User)
exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get complaints for cleaner's area
// @route   GET /api/complaints/cleaner-complaints
// @access  Private (Cleaner)
exports.getCleanerComplaints = async (req, res) => {
    try {
        const cleaner = await Cleaner.findById(req.user._id);

        const complaints = await Complaint.find({
            $or: [
                { area: cleaner.assignedArea },
                { assignedCleaner: cleaner._id }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign complaint to cleaner
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
exports.assignComplaint = async (req, res) => {
    try {
        const { cleanerId, expectedArrival } = req.body;

        const cleaner = await Cleaner.findById(cleanerId);

        if (!cleaner) {
            return res.status(404).json({
                success: false,
                message: 'Cleaner not found'
            });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                assignedCleaner: cleanerId,
                cleanerName: cleaner.name,
                cleanerPhone: cleaner.phone,
                expectedArrival: expectedArrival || 'Within 2 hours',
                status: 'assigned'
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Cleaner)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                status,
                collectionDate: status === 'collected' ? new Date() : null
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get analytics
// @route   GET /api/complaints/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const collectedComplaints = await Complaint.countDocuments({ status: 'collected' });
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
        const assignedComplaints = await Complaint.countDocuments({ status: 'assigned' });
        const notCollectedComplaints = await Complaint.countDocuments({ status: 'not_collected' });

        res.status(200).json({
            success: true,
            data: {
                total: totalComplaints,
                collected: collectedComplaints,
                pending: pendingComplaints,
                assigned: assignedComplaints,
                notCollected: notCollectedComplaints
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
