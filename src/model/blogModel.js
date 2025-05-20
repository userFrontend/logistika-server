const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: {
            type: Array,
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

module.exports = mongoose.model("Blog", blogSchema)