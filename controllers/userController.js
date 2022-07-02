const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const database = require('../models/database.js');
const User = require('../models/User.js');

const userController = {
    getSignup: (req, res) => {
        res.render('signup');
    },

    getLogin: (req, res) => {
        res.render('login');
    },

    getUser: (req, res) => {
        var query = req.params;

        database.findOne(User, query, null, (userObj) => {
            if(userObj instanceof Object) {
                var data = {
                    username: userObj.username,
                    description: userObj.shortDescription
                }
                res.render('user', data);
            }
            else {
                req.flash('error_msg', 'User does not exist...');
                res.redirect('/');
            }
        }); 
    },

    getSettings: (req, res) => {
        var query = req.params;

        database.findOne(User, query, null, (userObj) => {
            if(userObj instanceof Object) {
                var data = {
                    username: userObj.username,
                    description: userObj.shortDescription
                }
                res.render('editProfile', data);
            }
            else {
                req.flash('error_msg', 'User does not exist...');
                res.redirect('/');
            }
        }); 
    },

    getDelete: (req, res) => {
        var query = req.params;

        database.findOne(User, query, null, (userObj) => {
            if(userObj instanceof Object) {
                var data = {
                    username: userObj.username
                }
                res.render('delete', data);
            }
            else {
                req.flash('error_msg', 'User does not exist...');
                res.redirect('/');
            }
        }); 
    },
    
    getUserDeleted: (req, res) => {
        res.render('userDeleted');
    },

    getCheckDuplicate: (req, res) => {
        var query = req.query;

        database.findOne(User, query, null, (result) => {
            if(result instanceof Object) {
                res.send(result);
            }
            else
                res.send('');
        });
    },

    postAddUser: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            const { user, email, pass, desc} = req.body;

            database.findOne(User, {username: user}, null, (userObj) => {
                if(userObj instanceof Object) {

                    req.flash('error_msg', 'User already exists. Please log in.');
                    res.redirect('/login');
                }
                else {
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(pass, salt, (error, hash) => {
                            var userObj = {
                                emailAddress: email,
                                username: user,
                                password: hash,
                                //displayPicture: `/images/${displayPicture.name}`,
                                shortDescription: desc
                            };
                            database.insertOne(User, userObj, (success) => {
                                if(success) {
                                    req.flash('success_msg', 'You are now registered! Login below.');
                                    res.redirect('/login');
                                }
                                else {
                                    req.flash('error_msg', 'Could not create user. Please try again.');
                                    res.redirect('/signup');
                                }
                            });
                        });
                    });
                }
            }); 
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect('/signup');
        }
    },

    postLoginUser: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            const { userLog, password } = req.body;

            database.findOne(User, {username: userLog}, null, (user) => {
                if(user instanceof Object) {
                    bcrypt.compare(password, user.password, (error, result) => {
                        if(result) {
                            req.session.userID = user._id;
                            req.session.username = user.username;
                            req.session.isLoggedIn = true;

                            res.redirect('/');
                        }
                        else {
                            req.flash('error_msg', 'Invalid username or password. Please try again.');
                            res.redirect('/login');
                        }
                    });
                }
                else {
                    req.flash('error_msg', 'Invalid username or password. Please try again.');
                    res.redirect('/login');
                }
            });
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect('/login');
        }
    },

    getLogoutUser: (req, res) => {
        if(req.session) {
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/login');
            });
        }
    },

    postUpdateUser: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            var { userEdit, currPass, newPass, descEdit} = req.body;
            console.log(userEdit);
            database.findOne(User, {_id: req.session.userID}, null, (userObj) => {
                if(userObj instanceof Object) {
                    console.log(userObj.username);
                    database.findOne(User, {username: userEdit}, null, (user) => {
                        if((user instanceof Object) && (user.username === userEdit)) {
                            req.flash('error_msg', 'User already exists. Please enter a different username.');
                            res.redirect('/editProfile/' + req.session.username);
                        }
                        else {
                            bcrypt.compare(currPass, userObj.password, (error, result) => {
                                if(result) {
                                    if(userEdit === '')
                                        userEdit = userObj.username;
                                    if(newPass === '')
                                        newPass = currPass;
                                    if(descEdit === userObj.shortDescription)
                                        descEdit = userObj.shortDescription;
        
                                    bcrypt.genSalt(10, (error, salt) => {
                                        bcrypt.hash(newPass, salt, (error, hash) => {
                                            const update = {
                                                dateCreated: userObj.dateCreated,
                                                emailAddress: userObj.emailAddress,
                                                username: userEdit,
                                                password: hash,
                                                //displayPicture: {type: String, required: false},
                                                shortDescription: descEdit
                                            }
                                            database.updateOne(User, {_id: req.session.userID}, update, (success) => {
                                                if(success) {
                                                    req.session.username = update.username;
                                                    req.flash('success_msg', 'Successfully updated account details.');
                                                    res.redirect('/editProfile/' + req.session.username);
                                                }
                                                else {
                                                    req.flash('error_msg', 'Unable to update account details. Please try again.');
                                                    res.redirect('/editProfile/' + req.session.username);
                                                };
                                            });
                                        });
                                    });
                                }
                                else {
                                    req.flash('error_msg', 'Incorrect password. Please try again.');
                                    res.redirect('/editProfile/' + req.session.username);
                                }
                            });
                        }
                    });
                }
                else {
                    req.flash('error_msg', 'User not found. Please try again.');
                    res.redirect('/editProfile/' + req.session.username);
                }
            });
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect('/editProfile/' + req.session.username);
        }
    },

    postDeleteUser: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            const password = req.body.currPass;

            database.findOne(User, {_id: req.session.userID}, null, (user) => {
                if(user instanceof Object) {
                    bcrypt.compare(password, user.password, (error, result) => {
                        if(result) {
                            database.deleteOne(User, {_id: req.session.userID}, (success) => {
                                if(success) {
                                    req.session.destroy(() => {
                                        res.clearCookie('connect.sid');
                                        res.redirect('/userDeleted');
                                    });
                                }
                                else {
                                    req.flash('error_msg', 'Unable to delete account. Please try again.');
                                    res.redirect('/delete/' + req.session.username);
                                };
                            });
                        }
                        else {
                            req.flash('error_msg', 'Incorrect password. Please try again.');
                            res.redirect('/delete/' + req.session.username);
                        }
                    });
                }
                else {
                    req.flash('error_msg', 'User not found. Please try again.');
                    res.redirect('/delete/' + req.session.username);
                }
            });
        }
        else {
            const messages = errors.array().map((item) => item.msg);

            req.flash('error_msg', messages.join(' '));
            res.redirect('/delete/' + req.session.username);
        }
    }
}

module.exports = userController;