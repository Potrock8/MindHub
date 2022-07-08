const { validationResult } = require('express-validator');
const database = require('../models/database.js');
const Thread = require('../models/Thread.js');
const Comment = require('../models/Comment.js');

const fileUpload = require('express-fileupload');
const path = require('path');

const threadController = {
    getCreateThread: (req, res) => {
        res.render('createThread');
    },

    getThread: (req, res) => {
        var threadOwner = false;
        var image = false;

        database.findOne(Thread, { _id: req.params.id }, null, (found) => {
            if(found instanceof Object) {
                if(found.username === req.session.username)
                    threadOwner = true;
                if(found.img !== '')
                    image = true;
                database.findMany(Comment, { threadID: req.params.id }, null, (found2) =>{
                    if(found2.length === 0) {
                        data = {thread: found, isThreadOwner: threadOwner, hasImage: image};
                        res.render('thread1', data);
                    }
                    else {
                        for(i = 0; i < found2.length; i++) {
                            if(found2[i].username === req.session.username)
                                Object.assign(found2[i], { isCommentOwner: true });
                            else
                                Object.assign(found2[i], { isCommentOwner: false });
                        }
                        data = {thread: found, isThreadOwner: threadOwner, hasImage: image, comments: found2};
                        res.render('thread1', data);
                    }
                });
            }
            else {
                req.flash('error_msg', 'Thread not found. Please try again.');
                res.redirect('/');
            }
        });
    },

    getEditThread: (req, res) => {
        var thread = { _id: req.params.id }
        console.log(thread._id);
        database.findOne(Thread, thread, null, (threadObj)=>{
            if(threadObj instanceof Object)
                res.render('editThread', {thread: threadObj})
            else {
                req.flash('error_msg', 'Unable to find the requested page. Please try again');
                res.redirect('/');
            }
        })
    },

    getSearchResult: (req, res) => {
        const term = req.query.term.toString().toLowerCase();
        const query = { lowerCaseTitle: { $regex: new RegExp(term) } };

        database.findMany(Thread, query, null, (found) => {
            console.log(found)
            if(found.length === 0) {
                req.flash('error_msg', 'No results found...');
                res.redirect('/');
            }
            else
                res.render('search', {threads: found});
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
            var img;
            var imgName = '';

            database.findOne(Thread, {title: threadTitle}, null, (threadObj) => {
                if(threadObj instanceof Object) {
                    req.flash('error_msg', 'Thread title already exists. Please try a different thread title.');
                    res.redirect('/createThread');
                }
                else {
                    if(req.files !== null) {
                        img = req.files.img;
                        imgName = img.name;
                        img.mv(path.resolve(__dirname + '/..', 'public/images/threads', imgName));
                    }
                    var thread = {
                        dateCreated: Date.now(), 
                        title: threadTitle,
                        username: req.session.username,
                        content: threadContent,
                        lowerCaseTitle: threadTitle.toLowerCase(),
                        img: imgName
                    };
                
                    database.insertOne(Thread, thread, (success) => {
                        if(success) {
                            console.log('Successfully created thread');
                            database.findOne(Thread, {title: threadTitle}, null, (thread) => {
                                res.redirect(`/thread/${thread._id.toString()}`);
                            });
                        }
                        else {
                            req.flash('error_msg', 'Encountered an issue while creating the thread. Please try again.');
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
        database.deleteOne(Thread, { _id: req.params.id }, (found1) => {
            if(found1) {
                database.deleteMany(Comment, { threadID: req.params.id }, (found2) => {
                    req.flash('success_msg', 'Successfully deleted the thread.');
                    res.redirect('/');
                });
            }
			else {
				req.flash('error_msg', 'Encountered an issue while deleting the thread. Please try again.');
				res.redirect('/');
			}
        });	
    },

    postEditThread: (req,res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            database.findOne(Thread, { _id: req.body.threadID }, null, (found1) => {
                if(found1 instanceof Object) {
                    var thread = {
                        dateCreated: found1.dateCreated,
                        title: req.body.threadTitle,
                        username: req.session.username,
                        content: req.body.threadContent,
                        lowerCaseTitle: req.body.threadTitle.toLowerCase(),
                        img: found1.img
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
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect(`/getEditThread/${req.body.threadID}`);
        }
    }
    
}

module.exports = threadController;