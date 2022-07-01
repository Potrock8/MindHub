const express = require('express');
const router = express.Router();
const { isPublic, isPrivate, isSessionUser } = require('../middlewares/checkAuth.js');
const { deleteValidation, updateValidation } = require('../middlewares/validator.js');
const userController = require('../controllers/userController');

router.get('/user/:username', userController.getUser);

router.get('/editProfile/:username', isPrivate, isSessionUser, userController.getSettings);
router.get('/findDuplicate', userController.getCheckDuplicate);
router.post('/updateUser/:username', isPrivate, isSessionUser, updateValidation, userController.postUpdateUser);

router.get('/delete/:username', isPrivate, isSessionUser, userController.getDelete);
router.post('/deleteUser/:username', isPrivate, isSessionUser, deleteValidation, userController.postDeleteUser)

router.get('/userDeleted', isPublic, userController.getUserDeleted);

module.exports = router;