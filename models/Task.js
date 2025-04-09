const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: {
            type: [Number],
            required: function () { return this.location.type === 'Point'; } // Ensure only when type is "Point"
        }
    },
    deadline: { type: Date, required: true },
    budget: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' }
}, { timestamps: true });

TaskSchema.index({ location: '2dsphere' }); // Ensure geospatial indexing

module.exports = mongoose.model('Task', TaskSchema);
