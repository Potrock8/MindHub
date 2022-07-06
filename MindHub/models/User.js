const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    emailAddress: {type: String, required: true},
    username: {type: String, min: 8, max: 16, required: true},
    password: {type: String, min: 8, max: 16, required: true},
    shortDescription: {type: String, required: false}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;