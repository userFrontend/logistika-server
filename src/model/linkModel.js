const mongoose = require('mongoose');


const linkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    path: {
        type: String,
        required: true 
    },
    content: {
        type: String,
        required: true 
    },
    navbarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Navbar',
        required: true  
    },
    row: {
        type: String,
        default: '1'
    },
    active: {
        type: Boolean,
        default: true 
    },
},
{timestamps: true},
)

module.exports = mongoose.model("Link", linkSchema)