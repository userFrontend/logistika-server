const mongoose = require('mongoose');


const linkSchema = new mongoose.Schema({
    name: {
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
    active: {
        type: Boolean,
        default: true 
    },
},
{timestamps: true},
)

module.exports = mongoose.model("Link", linkSchema)