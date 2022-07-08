const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const database = require('../models/database.js');
const User = require('../models/User.js');
const Thread = require('../models/Thread.js');
const Comment = require('../models/Comment.js');

const fileUpload = require('express-fileupload');
const path = require('path');

const userController = {
    getSignup: (req, res) => {
        res.render('signup');
    },

    getLogin: (req, res) => {
        res.render('login');
    },

    getUser: (req, res) => {
        var query = req.params;
        var hasImage = false;

        database.findOne(User, query, null, (userObj) => {
            if(userObj instanceof Object) {
                if(userObj.img !== '')
                    hasImage = true;
                Object.assign(userObj, { hasImage: hasImage });
                database.findMany(Thread, { username: userObj.username }, null, (threadObj) => {
                    if(threadObj instanceof Object) {
                        res.render('user', { user: userObj, threads: threadObj });
                    }
                    else {
                        res.render('user', { user: userObj });
                    }
                });
   
            }
            else {
                req.flash('error_msg', 'User not found. Please try again.');
                res.redirect('/');
            }
        }); 
    },

    getSettings: (req, res) => {
        var query = req.params;
        var hasImage = false;

        database.findOne(User, query, null, (userObj) => {
            if(userObj instanceof Object) {
                if(userObj.img !== '')
                    hasImage = true;

                var data = {
                    username: userObj.username,
                    description: userObj.shortDescription,
                    img: userObj.img,
                    hasImage: hasImage
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
        var hasImage = false;

        database.findOne(User, query, null, (userObj) => {
            if(userObj instanceof Object) {
                if(userObj.img !== '')
                    hasImage = true;

                var data = {
                    username: userObj.username,
                    img: userObj.img,
                    hasImage: hasImage
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
            var img;
            var imgName = '';

            database.findOne(User, {username: user}, null, (userObj) => {
                if(userObj instanceof Object) {
                    req.flash('error_msg', 'User already exists. Please log in.');
                    res.redirect('/login');
                }
                else {
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(pass, salt, (error, hash) => {
                            if(req.files !== null) {
                                img = req.files.img;
                                imgName = img.name;
                                img.mv(path.resolve(__dirname + '/..', 'public/images/users', imgName));
                            }

                            var registerUser = {
                                emailAddress: email,
                                username: user,
                                password: hash,
                                shortDescription: desc,
                                img: imgName
                            };
                            console.log(registerUser);
                            database.insertOne(User, registerUser, (success) => {
                                console.log(registerUser);
                                console.log(success);
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
            var img;
            var imgName = '';
            console.log(req.files)
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
                                            if(req.files !== null) {
                                                img = req.files.editImg;
                                                imgName = img.name;
                                                img.mv(path.resolve(__dirname + '/..', 'public/images/users', imgName));
                                            }

                                            const update = {
                                                dateCreated: userObj.dateCreated,
                                                emailAddress: userObj.emailAddress,
                                                username: userEdit,
                                                password: hash,
                                                shortDescription: descEdit,
                                                img: imgName
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
            const sessionUser = req.session.username;

            database.findOne(User, {_id: req.session.userID}, null, (user) => {
                if(user instanceof Object) {
                    bcrypt.compare(password, user.password, (error, result) => {
                        if(result) {
                            database.deleteOne(User, {_id: req.session.userID}, (success) => {
                                if(success) {
                                    database.deleteMany(Thread, {username: sessionUser}, (success1) => {
                                        if(success1) {
                                            database.deleteMany(Comment, {username: sessionUser}, (success2) => {
                                                if(success2) {
                                                    console.log("Successfully deleted user along with posts and comments.")
                                                }
                                            });
                                        }
                                    });
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