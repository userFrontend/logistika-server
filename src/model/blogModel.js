const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        type: String,
        read: String,
        categoryIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true,
            }
        ],
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: {
            type: Object,
            default: null
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