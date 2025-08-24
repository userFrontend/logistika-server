const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // kitob nomi majburiy
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        default: 0, // mavjud kitoblar soni
        min: 0
    },
    image: {
        type: String, // kitob rasmi URL yoki fayl nomi
        default: null
    },
    category: {
        type: String,
        enum: ["special_offer", "salable", "popular", "new"], // oldindan belgilangan kategoriyalar
        default: "popular"
    },
    isNew: {
        type: Boolean,
        default: false
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, 
{timestamps: true});

module.exports = mongoose.model("AboutBook", bookSchema);
