const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    commentID: {type: Number, required: true},
    threadID: {type: Number, required: true},
	dateCreated: {type: Date, required: true},
    username: {type: String, required: true},
    content: {type: String, required: true}
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;