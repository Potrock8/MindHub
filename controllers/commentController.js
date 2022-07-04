const database = require('../models/database.js');
const Comment = require('../models/Comment.js');

const commentController = {
    postAddComment: (req, res) => {
        console.log(req.body.commentContent);
           var comment = {
                username: req.session.username,
                content: req.body.commentContent,
                threadID: req.body.threadID,
                dateCreated: Date.now(),
            };
            console.log(comment);
            database.insertOne(Comment, comment, (success) => {
                console.log(success);
                if(success) {
                    console.log('Successfully created new comment.');
                    res.redirect(`/thread/${comment.threadID}`);
                }
                else {
                    req.flash('error_msg', 'Could not create new comment. Please try again.');
                    res.redirect(`/thread/${comment.threadID}`);
                }
            })
    },

    getEditComment: (req, res) => {
        var comment = { _id: req.params.commentid }

        database.findOne(Comment, comment, null, (found) => {
            if(found instanceof Object)
                res.render('editComment', found);
            else {
                req.flash('error_msg', 'Could not find the comment. Please try again.');
                res.redirect('/');
            }
        });
    },

    postEditComment: (req,res) => {
        var comment = {
            _id: req.body.commentID,
            content: req.body.commentContent
        }

        database.findOne(Comment, comment, null, (found1) => {
            if(found1 instanceof Object) {
                database.updateOne(Comment, { _id: req.body.commentID }, comment, (found2) => {
                    if(found2) {
                        req.flash('success_msg', 'Successfully updated the comment.');
                        res.redirect(`/thread/${found1.threadID}`);
                    }
                    else {
                        req.flash('error_msg', 'Encountered an error while updating the comment. Please try again.');
                        res.redirect(`/editThread/${found1.threadID}`);
                    }
                });
            }
            else {
                req.flash('error_msg', 'Encountered an error while updating the comment. Please try again.');
                res.redirect(`/editThread/${req.params.id}`);
            }
        });
    },

    postDeleteComment: (req, res) => {
        database.findOne(Comment, {_id: req.body.commentID}, null, (found1) =>{
            if (found1 instanceof Object){
                console.log(found1);
                database.deleteOne(Comment, {_id: found1._id}, (found2) => {
                    console.log(found2);
                    if(found2) {
                        res.redirect(`/thread/${req.params.id}`)
                    }
                    else { 
                        req.flash('error_msg', 'Encountered an error while deleting the comment. Please try again.');
                        res.redirect(`/thread/${req.params.id}`);
                    }
                });
            }
            else {
                req.flash('error_msg', 'Encountered an error while deleting the comment. Please try again.');
                res.redirect(`/thread/${req.params.id}`);
            }
           
        });
    }
}

module.exports = commentController;