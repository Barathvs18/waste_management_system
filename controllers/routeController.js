const Route = require('../models/Route');
const Cleaner = require('../models/Cleaner');

// @desc    Create route
// @route   POST /api/routes
// @access  Private (Admin)
exports.createRoute = async (req, res) => {
    try {
        const { cleanerId, area, date, startTime, endTime, description } = req.body;

        const cleaner = await Cleaner.findById(cleanerId);

        if (!cleaner) {
            return res.status(404).json({
                success: false,
                message: 'Cleaner not found'
            });
        }

        const route = await Route.create({
            cleanerId,
            cleanerName: cleaner.name,
            area,
            date,
            startTime,
            endTime,
            description
        });

        res.status(201).json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all routes
// @route   GET /api/routes
// @access  Private (Admin)
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: routes.length,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get cleaner's routes
// @route   GET /api/routes/my-routes
// @access  Private (Cleaner)
exports.getMyRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ cleanerId: req.user._id }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: routes.length,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update route status
// @route   PUT /api/routes/:id/status
// @access  Private (Cleaner)
exports.updateRouteStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const route = await Route.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete route
// @route   DELETE /api/routes/:id
// @access  Private (Admin)
exports.deleteRoute = async (req, res) => {
    try {
        await Route.findByIdAndDelete(req.params.id);

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
