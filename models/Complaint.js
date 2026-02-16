const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'Waste Not Collected'
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'collected', 'not_collected'],
        default: 'pending'
    },
    assignedCleaner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cleaner',
        default: null
    },
    cleanerName: {
        type: String,
        default: ''
    },
    cleanerPhone: {
        type: String,
        default: ''
    },
    expectedArrival: {
        type: String,
        default: ''
    },
    collectionDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
