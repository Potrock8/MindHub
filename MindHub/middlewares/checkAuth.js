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

module.exports = { isPublic, isPrivate, isSessionUser };