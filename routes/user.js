const express = require('express');
const router = express.Router();
const { isPublic, isPrivate, isSessionUser } = require('../middlewares/checkAuth.js');
const { updateUserValidation, deleteUserValidation } = require('../middlewares/validator.js');
const userController = require('../controllers/userController');

router.get('/user/:username', userController.getUser);

router.get('/editProfile/:username', isPrivate, isSessionUser, userController.getSettings);
router.get('/findDuplicate', userController.getCheckDuplicate);
router.post('/updateUser/:username', isPrivate, isSessionUser, updateUserValidation, userController.postUpdateUser);

router.get('/delete/:username', isPrivate, isSessionUser, userController.getDelete);
router.post('/deleteUser/:username', isPrivate, isSessionUser, deleteUserValidation, userController.postDeleteUser)

router.get('/userDeleted', isPublic, userController.getUserDeleted);

module.exports = router;