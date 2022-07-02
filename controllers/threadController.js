const { validationResult } = require('express-validator');
const database = require('../models/database.js');
const Thread = require('../models/Thread.js');

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

                res.render('thread', data);
            }
            else {
                req.flash('error_msg', 'Thread does not exist...');
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
                        title: threadTitle,
                        username: req.session.username,
                        content: threadContent
                    };

                    database.insertOne(Thread, thread, (success) => {
                        if(success) {
                            console.log('Successfully created thread');
                            res.redirect('/thread/' + thread.title);
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
    }
}

module.exports = threadController;