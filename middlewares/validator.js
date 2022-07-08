const { body } = require('express-validator');

const signupValidation = [
    body('user').not().isEmpty().withMessage('Username is required.')
        .isLength({ min: 8 }).withMessage('Username must be at least 8 characters long.'),

    body('email').not().isEmpty().withMessage('Email Address is required.')
        .isEmail().withMessage('Please provide a valid Email Address.'),

    body('pass').not().isEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .custom((value) => {
            var lowercase = /[a-z]/;
            var uppercase = /[A-Z]/;
            var numbers = /[0-9]/;

            if(value.match(lowercase) && value.match(uppercase) && value.match(numbers) || (value === ''))
                return true;

            throw new Error('Password must contain a mixture of uppercase characters, lowercase characters, and numbers.');
    }),

    body('confirmPass').isLength({ min: 8 }).withMessage('Password confirmation must be at least 8 characters long.')
        .custom((value, { req }) => {
            if(value !== req.body.pass)
                throw new Error('Passwords must match.');

            return true;
    }),

    body('img').custom((value, { req }) => {
        if(req.files !== null) {
            var imgName = req.files.img.name;
            var imgExtension = imgName.slice(-4).toLowerCase();
            if((imgExtension === '.jpg') || (imgExtension === '.png') || (imgExtension === 'jpeg'))
                return true;
            else
                throw new Error('File extension must be either ".jpg", ".png", or ".jpeg".');
        }
        else
            return true;

    })
];

const loginValidation = [
    body('userLog').not().isEmpty().withMessage('Please enter your username.')
        .isLength({ min: 8 }).withMessage("Usernames are at least 8 characters long."),

    body('password').not().isEmpty().withMessage('Please enter your password.')
        .isLength({ min: 8 }).withMessage("Passwords are at least 8 characters long.")
];

const updateUserValidation = [
    body('userEdit').custom((value) => {
        if((value.length > 0) && (value.length < 8))
            throw new Error('New username must be at least 8 characters long.');

        return true;
    }),

    body('currPass').not().isEmpty().withMessage('Please enter your current password in order to save your changes.'),

    body('newPass').custom((value, { req }) => {
            var lowercase = /[a-z]/;
            var uppercase = /[A-Z]/;
            var numbers = /[0-9]/;

            if((value === req.body.currPass) && (req.body.currPass !== ''))
                throw new Error('New password must not match the current password.');

            if((value.length > 0) && (value.length < 8))
                throw new Error('New password must be at least 8 characters long.');

            if(value.match(lowercase) && value.match(uppercase) && value.match(numbers) || (value === ''))
                return true;
            else
                throw new Error('New password must contain a mixture of uppercase characters, lowercase characters, and numbers.');
    }),

    body('confirmNewPass').custom((value, { req }) => {
        if(value !== req.body.newPass)
            throw new Error('New password confirmation must match.');
        if((value.length > 0) && (value.length < 8))
            throw new Error('New password must be at least 8 characters long.');
        
        return true;
    }),

    body('editImg').custom((value, { req }) => {
        if(req.files !== null) {
            var imgName = req.files.editImg.name;
            var imgExtension = imgName.slice(-4).toLowerCase();
            if((imgExtension === '.jpg') || (imgExtension === '.png') || (imgExtension === 'jpeg'))
                return true;
            else
                throw new Error('File extension must be either ".jpg", ".png", or ".jpeg".');
        }
        else
            return true;

    })
];

const deleteUserValidation = [
    body('currPass').not().isEmpty().withMessage('Please enter your current password.')
        .isLength({ min: 8 }).withMessage('Passwords are at least 8 characters long.'),
];

const threadValidation = [
    body('threadTitle').not().isEmpty().withMessage('Thread title is required.')
        .isLength({ min: 3 }).withMessage('Thread title must be at least 3 characters long.'),

    body('threadContent').not().isEmpty().withMessage('Thread content is required.')
        .isLength({ min: 1 }).withMessage('Thread content must be at least 1 character long.'),

    body('img').custom((value, { req }) => {
        if(req.files !== null) {
            var imgName = req.files.img.name;
            var imgExtension = imgName.slice(-4).toLowerCase();
            if((imgExtension === '.jpg') || (imgExtension === '.png') || (imgExtension === 'jpeg'))
                return true;
        }
        else if(req.files === null)
            return true;
        else
            throw new Error('File extension must be either ".jpg", ".png", or ".jpeg".');
    })
    
];

const commentValidation = [
    body('commentContent').not().isEmpty().withMessage('Comment content is required if you wish to reply to a post.')
        .isLength({ min: 1 }).withMessage('Comment must be at least 1 character long.')
]

module.exports = { signupValidation, loginValidation, updateUserValidation, 
                    deleteUserValidation, threadValidation, commentValidation };