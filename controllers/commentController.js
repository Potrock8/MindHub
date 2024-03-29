const { validationResult } = require('express-validator');
const database = require('../models/database.js');
const Comment = require('../models/Comment.js');

const commentController = {
    postAddComment: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
           var comment = {
                username: req.session.username,
                content: req.body.commentContent,
                threadID: req.body.threadID,
                dateCreated: Date.now(),
            };
            database.insertOne(Comment, comment, (success) => {
                if(success) {
                    console.log('Successfully created new comment.');
                    res.redirect(`/thread/${comment.threadID}`);
                }
                else {
                    req.flash('error_msg', 'Encountered an error while creating the comment. Please try again.');
                    res.redirect(`/thread/${comment.threadID}`);
                }
            });
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect(`/thread/${req.body.threadID}`);
        }
    },

    getEditComment: (req, res) => {
        var comment = { _id: req.params.commentid }

        database.findOne(Comment, comment, null, (found) => {
            if(found instanceof Object)
                res.render('editComment', {comment: found});
            else {
                req.flash('error_msg', 'Comment not found. Please try again.');
                res.redirect('/');
            }
        });
    },

    postEditComment: (req,res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            var comment = {
                _id: req.params.commentid,
                content: req.body.commentContent
            }

            database.findOne(Comment, { _id: comment._id}, null, (found1) => {
                if(found1 instanceof Object) {
                    database.updateOne(Comment, { _id: comment._id}, comment, (found2) => {
                        if(found2) {
                            req.flash('success_msg', 'Successfully updated the comment.');
                            res.redirect(`/thread/${found1.threadID}`);
                        }
                        else {
                            req.flash('error_msg', 'Encountered an error while updating the comment. Please try again.');
                            res.redirect(`/thread/${found1.threadID}`);
                        }
                    });
                }
                else {
                    req.flash('error_msg', 'Comment not found. Please try again.');
                    res.redirect(`/thread/${req.params.id}/getEditComment/${req.params.commentid}`);
                }
            });
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect(`/thread/${req.params.id}/getEditComment/${req.params.commentid}`);
        }
    },

    postDeleteComment: (req, res) => {
        database.findOne(Comment, { _id: req.params.commentid }, null, (found1) =>{
            if(found1 instanceof Object){
                database.deleteOne(Comment, { _id: found1._id }, (found2) => {
                    if(found2) {
                        req.flash('success_msg', 'Successfully deleted the comment.');
                        res.redirect(`/thread/${req.params.id}`)
                    }
                    else { 
                        req.flash('error_msg', 'Encountered an error while deleting the comment. Please try again.');
                        res.redirect(`/thread/${req.params.id}`);
                    }
                });
            }
            else {
                req.flash('error_msg', 'Comment not found. Please try again.');
                res.redirect(`/thread/${req.params.id}`);
            }
           
        });
    }
}

module.exports = commentController;