const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('User', UserSchema);