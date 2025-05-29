const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        stars: String,
        created: String,
        image: String,
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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

module.exports = mongoose.model("Review", reviewSchema)