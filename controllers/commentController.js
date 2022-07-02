const database = require('../models/database.js');
const Comment = require('../models/Comment.js');

const commentController = {
    //not sure
    getThread: (req, res) => {
        var query = req.params;

        database.findOne(Comment, query, null, (commentObj) => {
            if(commentObj instanceof Object) {
                var data = {
                    _id: commentObj._id,
                    dateCreated: commentObj.dateCreated,
                    threadID: commentObj.threadID,
                    username: commentObj.username,
                    content: commentObj.content
                };
                //not sure
                res.render('comment', data);
            }
            else {
                req.flash('error_msg', 'comment does not exist...');
                res.redirect('/thread/' ); //thread title sana
            }
        });
    },

    postAddComment: (req, res) => {
        const threadTitle = req.params.title;
        const { threadID, commentContent } = req.body;

        if(commentContent.length > 0) {
           var comment = {
                threadID: threadID,
                username: req.session.username,
                content: commentContent
            };

            database.insertOne(Comment, comment, (success) => {
                if(success) {
                    console.log('Successfully created new comment');
                    res.redirect('/thread/' + threadTitle);
                }
                else {
                    req.flash('error_msg', 'Could not create new comment. Please try again.');
                    res.redirect('/thread/' + threadTitle);
                }
            })
        }
        else {
            req.flash('error_msg', 'Comment field must not be empty if you wish to post a comment.');
            res.redirect('/thread/' + threadTitle);
        }
    }
}

module.exports = commentController;