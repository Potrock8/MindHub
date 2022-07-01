const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
	threadID: {type: Number, required: true},
    dateCreated: {type: Date, required: true},
	title: {type: String, required: true},
    username: {type: String, required: true},
    content: {type: String, required: true}
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;