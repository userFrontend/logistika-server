const mongoose = require('mongoose');


const aboutSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true 
    },
    contact: {
        type: String,
        required: true 
    },
    homeImg: {
        type: Object,
        default: null
    },
    active: {
        type: Boolean,
        default: true
    },
    homeTitle: String,
    homeContent: String,
    color: String,
    telegram: String,
    instagram: String,
    twitter: String,
    youtube: String,
},
{timestamps: true},
)

module.exports = mongoose.model("About", aboutSchema)