const Cleaner = require('../models/Cleaner');

// @desc    Get all cleaners
// @route   GET /api/cleaners
// @access  Private (Admin)
exports.getAllCleaners = async (req, res) => {
    try {
        const cleaners = await Cleaner.find().select('-password');

        res.status(200).json({
            success: true,
            count: cleaners.length,
            data: cleaners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get cleaner profile
// @route   GET /api/cleaners/profile
// @access  Private (Cleaner)
exports.getCleanerProfile = async (req, res) => {
    try {
        const cleaner = await Cleaner.findById(req.user._id).select('-password');

        res.status(200).json({
            success: true,
            data: cleaner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update cleaner status
// @route   PUT /api/cleaners/status
// @access  Private (Cleaner)
exports.updateCleanerStatus = async (req, res) => {
    try {
        const { status, currentLocation } = req.body;

        const cleaner = await Cleaner.findByIdAndUpdate(
            req.user._id,
            { status, currentLocation: currentLocation || '' },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            data: cleaner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update cleaner assigned area
// @route   PUT /api/cleaners/:id/area
// @access  Private (Admin)
exports.updateCleanerArea = async (req, res) => {
    try {
        const { assignedArea } = req.body;

        const cleaner = await Cleaner.findByIdAndUpdate(
            req.params.id,
            { assignedArea },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            data: cleaner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete cleaner
// @route   DELETE /api/cleaners/:id
// @access  Private (Admin)
exports.deleteCleaner = async (req, res) => {
    try {
        await Cleaner.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
