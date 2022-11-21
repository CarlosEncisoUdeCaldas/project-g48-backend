const mongoose = require('mongoose')
const { Schema } = mongoose

let UserSchema = new Schema( {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    userDateCreate: {
        type: Date,
        default: Date.now
    }
    // telefono: Number,
} );

module.exports = mongoose.model('User', UserSchema, 'Users')
