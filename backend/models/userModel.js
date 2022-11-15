const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    resetToken : {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema, 'Users');
