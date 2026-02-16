const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    cleanerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cleaner',
        required: true
    },
    cleanerName: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
