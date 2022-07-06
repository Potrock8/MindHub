const express = require('express');
const router = express.Router();
const { signupValidation, loginValidation } = require('../middlewares/validator.js');
const { isPublic, isPrivate} = require('../middlewares/checkAuth.js');
const userController = require('../controllers/userController.js');

router.get('/signup', isPublic, userController.getSignup);
router.post('/addUser', isPublic, signupValidation, userController.postAddUser);

router.get('/login', isPublic, userController.getLogin);
router.post('/loginUser', isPublic, loginValidation, userController.postLoginUser);

router.get('/logout', isPrivate, userController.getLogoutUser);

module.exports = router;