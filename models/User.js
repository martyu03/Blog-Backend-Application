const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {  
        type: String,
        required: [true, 'Username is required'],
        trim: true  // Trim whitespace
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true  // Trim whitespace
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);
