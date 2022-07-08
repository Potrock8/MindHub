const database = require('../models/database.js');
const Thread = require('../models/Thread.js');
const Comment = require('../models/Comment.js');

isPublic = (req, res, next) => {
    if(req.session.userID) {
        req.flash('error_msg', 'You are already logged in.');
        res.redirect('/');
    }
    else
        return next();
};

isPrivate = (req, res, next) => {
    if(req.session.userID)
        return next();
    else {
        req.flash('error_msg', 'You must be logged in to access the requested page.');
        res.redirect('/login');
    }
};

isSessionUser = (req, res, next) => {
    if(req.session.username === req.params.username)
        return next();
    else {
        req.flash('error_msg', 'You do not have access to the requested page.');
        res.redirect('/');
    }
};

isThreadOwner = (req, res, next) => {
    database.findOne(Thread, { _id: req.params.id }, null, (result) => {
        if(result instanceof Object) {
            if(result.username === req.session.username)
                return next();
            else {
                req.flash('error_msg', 'Access Denied. You do not own the thread.');
                res.redirect(`/thread/${req.params.id}`);
            }
        }
        else {
            req.flash('error_msg', 'Thread not found. Please try again');
            res.redirect('/');
        }
    });
};

//'/thread/:id/getEditComment/:commentid'

isCommentOwner = (req, res, next) => {
    database.findOne(Comment, { _id: req.params.commentid }, null, (result) => {
        if(result instanceof Object) {
            if(result.username === req.session.username)
                return next();
            else {
                req.flash('error_msg', 'Access Denied. You do not own the comment.');
                res.redirect(`/thread/${req.params.id}`);
            }
        }
        else {
            req.flash('error_msg', 'Comment not found. Please try again');
            res.redirect('/');
        }
    });
};

module.exports = { isPublic, isPrivate, isSessionUser, isThreadOwner, isCommentOwner };