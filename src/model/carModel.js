const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        method: {
            type: String,
            default: 'car'
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        photos: {
            type: Array,
            default: [],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
},
{timestamps: true},
)

module.exports = mongoose.model("Car", carSchema)