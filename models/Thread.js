const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
	dateCreated: {type: Date, required: true},
	title: {type: String, min: 3, max: 50, required: true},
    username: {type: String, min: 8, max: 16, required: true},
    content: {type: String, min: 1, required: true},
    lowerCaseTitle: {type: String, required: true},
    img:{type: String, required: false},
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;