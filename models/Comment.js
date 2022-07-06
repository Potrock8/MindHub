const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
	dateCreated: {type: Date, required: true},
    threadID: {type: String, required: true},
    username: {type: String, required: true},
    content: {type: String, min: 1, required: true}
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;