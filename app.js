const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const express = require('express');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const expressValidator = require('express-validator');
const MongoStore = require('connect-mongo');
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

const database = require('./models/database.js');
const authRouter = require('./routes/auth.js');
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');
const threadRouter = require('./routes/thread.js');
const commentRouter = require('./routes/comment.js');

const app = new express();

const fileUpload = require('express-fileupload');

dotenv.config();
port = process.env.PORT || 3000;
url = process.env.DB_URL || 'mongodb://localhost:27017/MindHub';
key = process.env.SESSION_KEY;

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, './views/layouts'),
    partialsDir: path.join(__dirname, './views/partials')
}));

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

handlebars.registerHelper('sameUser', (sessionUser, user, options) => {
    if(sessionUser === user)
        return '<a id="editProfile" href="/editProfile/' + sessionUser + '">Edit Profile</a>' +
        '<a id="deleteUser" href="/delete/' + sessionUser + '">Delete Account</a>';
    return options.inverse(this);
});

app.use(express.static('public'));

database.connect(url);

app.use(session({
    secret: key,
    store: new MongoStore({mongoUrl: url}),
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 * 7},
    isLoggedIn: false
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.session = req.session;
    next();
}); 

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', threadRouter);
app.use('/', commentRouter);

const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}.`);
});