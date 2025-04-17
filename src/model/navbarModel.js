const mongoose = require('mongoose');


const navbarSchema = new mongoose.Schema({
    name: {
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

module.exports = mongoose.model("Navbar", navbarSchema)