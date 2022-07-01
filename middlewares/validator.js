const { body } = require('express-validator');

const signupValidation = [
    body('user').not().isEmpty().withMessage('Username is required.')
        .isLength({ min: 8 }).withMessage('Username must be at least 8 characters long.'),

    body('email').not().isEmpty().withMessage('Email Address is required.')
        .isEmail().withMessage('Please provide a valid Email Address.'),

    body('pass').not().isEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),

    body('confirmPass').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .custom((value, { req }) => {
            if(value !== req.body.pass)
                throw new Error('Passwords must match.');

            return true;
    })
];

const loginValidation = [
    body('userLog').not().isEmpty().withMessage('Please enter your username.')
        .isLength({ min: 8 }).withMessage("Usernames are at least 8 characters long."),

    body('password').not().isEmpty().withMessage('Please enter your password.')
        .isLength({ min: 8 }).withMessage("Passwords are at least 8 characters long.")
];

const deleteValidation = [
    body('currPass').not().isEmpty().withMessage('Please enter your current password.')
        .isLength({ min: 8 }).withMessage('Passwords are at least 8 characters long.'),
];

const updateValidation = [
    body('userEdit').custom((value) => {
        if((value.length > 0) && (value.length < 8))
            throw new Error('New username must be at least 8 characters long.');
        
        return true;
    }),

    body('currPass').not().isEmpty().withMessage('Please enter your current password in order to save your changes.')
        .isLength({ min: 8 }).withMessage('Passwords are at least 8 characters long.'),

    body('newPass').custom((value, { req }) => {
            var lowercase = /[a-z]/;
            var uppercase = /[A-Z]/;
            var numbers = /[0-9]/;

            if((value.length > 0) && (value.length < 8))
                throw new Error('New password must be at least 8 characters long.');

            if((value === req.body.currPass) && (req.body.currPass !== ''))
                throw new Error('New password must not match the current password.');

            if(value.match(lowercase) && value.match(uppercase) && value.match(numbers) || (value === ''))
                return true;
            else
                throw new Error('New password must contain a mixture of uppercase characters, lowercase characters, and numbers.');
    }),

    body('confirmNewPass').custom((value, { req }) => {
        if((value.length > 0) && (value.length < 8))
            throw new Error('New password must be at least 8 characters long.');
        if(value !== req.body.newPass)
            throw new Error('New passwords must match.');
        
        return true;
    })
];

module.exports = { signupValidation, loginValidation, deleteValidation, updateValidation };