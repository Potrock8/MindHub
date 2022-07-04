const { validationResult } = require('express-validator');
const database = require('../models/database.js');
const Thread = require('../models/Thread.js');
const Comment = require('../models/Comment.js');

const threadController = {
    getCreateThread: (req, res) => {
        res.render('createThread');
    },

    getThread: (req, res) => {
        var query = req.params;

        database.findOne(Thread, query, null, (threadObj) => {
            if(threadObj instanceof Object) {
                var data = {
                    _id: threadObj._id,
                    dateCreated: threadObj.dateCreated,
                    title: threadObj.title,
                    username: threadObj.username,
                    content: threadObj.content
                }

                database.findMany(Comment, {threadID: req.params.id }, null, (comments) => {
                    if(comments !== false)
                        res.render('thread1', {thread: data, comments: comments});
                    else
                        res.render('thread1', {thread: data});
                });
            }
            else {
                req.flash('error_msg', 'Thread does not exist...');
                res.redirect('/');
            }
        });
    },

    getEditThread: (req, res) => {
        var thread = { _id: req.params.id }
        console.log(thread._id);
        database.findOne(Thread, thread, null, (threadObj)=>{
            if(threadObj instanceof Object) {
                res.render('editThread', threadObj)
            }
            else {
                req.flash('error_msg', 'Unable to find the requested page. Please try again');
                res.redirect('/');
            }
        })
    },

    getSearchResult: (req, res) => {
        const term = req.query.term.toString();
        const query = {lowerCaseTitle:{$regex: new RegExp(term)}};

        database.findMany(Thread, query, null, (found) => {
            if(found)
                res.render('search', {result: found});
            else{
                req.flash('error_msg', 'No results...')
                res.redirect('/');
            }
        });
    },

    getCheckDuplicate: (req, res) => {
        var query = req.query;

        database.findOne(Thread, query, null, (found) => {
            if(found instanceof Object)
                res.send(found);
            else
                res.send('');
        });
    },

    postAddThread: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            const { threadTitle, threadContent} = req.body;

            database.findOne(Thread, {title: threadTitle}, null, (threadObj) => {
                if(threadObj instanceof Object) {

                    req.flash('error_msg', 'Thread title already exists. Please try a different thread title.');
                    res.redirect('/createThread');
                }
                else {
                    var thread = {
                        dateCreated: Date.now(), 
                        title: threadTitle,
                        username: req.session.username,
                        content: threadContent,
                        lowerCaseTitle: threadTitle.toLowerCase(),
                    };

                    database.insertOne(Thread, thread, (success) => {
                        if(success) {
                            console.log('Successfully created thread');
                            database.findOne(Thread, {title: threadTitle}, null, (thread) => {
                                res.redirect(`/thread/${thread._id}`);
                            });
                        }
                        else {
                            req.flash('error_msg', 'Could not create thread. Please try again.');
                            res.redirect('/createThread');
                        }
                    });
                }
            });
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect('/createThread');
        }
    },

    postDeleteThread: (req, res) => {
        database.deleteOne(Thread, {_id: req.params.id}, (found1) => {
            if(found1) {
                database.deleteMany(Comment, {threadID: req.params.id}, (found2) => {
                    if(found2) {
						req.flash('success_msg', 'Successfully deleted the thread.');
                        res.redirect('/');
                    }
                });
            }
			else {
				req.flash('error_msg', 'Encountered an issue while deleting the thread. Please try again.');
				res.redirect(`/`);
			}
        });	
    },

    postEditThread: (req,res) => {
        database.findOne(Thread, {_id: req.body.threadID}, null, (found1) => {
            if(found1 instanceof Object) {
                var thread = {
                    dateCreated: found1.dateCreated,
                    title: req.body.threadTitle,
                    username: req.session.username,
                    content: req.body.threadContent,
                    lowerCaseTitle: req.body.threadTitle.toLowerCase()
                }
                database.updateOne(Thread, {_id: found1._id}, thread, (found2) => {
                    if(found2) {
                        req.flash('success_msg', 'Successfully updated the thread.');
				        res.redirect(`/thread/${found1._id}`);
                    }
                    else {
                        req.flash('error_msg', 'Encountered an issue while updating the thread. Please try again.');
				        res.redirect(`/thread/${found1._id}`);
                    }
                });
            }
            else {
                req.flash('error_msg', 'Encountered an issue while updating the thread. Please try again.');
				res.redirect(`/thread/${found1._id}`);
            }       
        });
    }
    
}

module.exports = threadController;