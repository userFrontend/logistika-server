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
    appPassword: String,
    featured: String,
    private: String,
    homeTitle: String,
    homeContent: String,
    color: String,
    telegram: String,
    instagram: String,
    twitter: String,
    youtube: String,
    location: String,
    localPhone: String,
    fax: String,
    sendEmail: String,
    vehicles: Number,
    satisfied: Number,
    drivers: Number,
    experience: Number,
},
{timestamps: true},
)

module.exports = mongoose.model("About", aboutSchema)