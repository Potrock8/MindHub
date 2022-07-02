const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    dateCreated: {type: Date, default: Date.now(), required: true},
    emailAddress: {type: String, required: true},
    username: {type: String, min: 8, max: 16, required: true},
    password: {type: String, min: 8, max: 16, required: true},
    displayPicture: {type: String, required: false},
    shortDescription: {type: String, required: false}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;