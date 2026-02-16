const mongoose = require('mongoose');

const cleanerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    vehicleNumber: {
        type: String,
        required: [true, 'Please provide vehicle number'],
        unique: true
    },
    assignedArea: {
        type: String,
        required: [true, 'Please provide assigned area']
    },
    role: {
        type: String,
        default: 'cleaner'
    },
    status: {
        type: String,
        enum: ['idle', 'on_the_way', 'arrived', 'completed'],
        default: 'idle'
    },
    currentLocation: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cleaner', cleanerSchema);
