const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user being reviewed
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who submitted the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating (1-5)
    description: { type: String, required: true }, // Review description
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
