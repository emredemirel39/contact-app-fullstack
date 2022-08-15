const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    surname: {
        type: String,
        unique: false
    },
    email: {
        type: String,
        unique: false
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: false
    },
    ownerId: {
        type: String,
        required: true,
        unique: false
    }
});

module.exports = mongoose.model('Contact', ContactSchema);