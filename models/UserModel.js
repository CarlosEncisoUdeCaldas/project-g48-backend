const mongoose = require('mongoose')
const { Schema } = mongoose

let UserSchema = new Schema( {
    firstname: String,
    lastname: String,
    email: String,
    telefono: Number,
    password: String,
    userDateCreate: {
        type: Date,
        default: Date.now
    }
} );

module.exports = mongoose.model('User', UserSchema, 'Users')
