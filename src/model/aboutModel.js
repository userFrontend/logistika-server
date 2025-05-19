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
    homeImg: String,
    homeTitle: String,
    homeContent: String,
    telegram: String,
    instagram: String,
    twitter: String,
    youtube: String,
},
{timestamps: true},
)

module.exports = mongoose.model("About", aboutSchema)