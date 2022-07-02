const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
	dateCreated: {type: Date, default: Date.now(), required: true},
	title: {type: String, min: 3, max: 50, required: true},
    username: {type: String, min: 8, max: 16, required: true},
    content: {type: String, min: 3, required: true},
    img:{
        data: Buffer,
        contentType: String
    }
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;