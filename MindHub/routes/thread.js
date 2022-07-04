const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController.js');
const { isPrivate, isSessionUser } = require('../middlewares/checkAuth.js');
const { addThreadValidation } = require('../middlewares/validator.js');

router.get('/createThread', isPrivate, threadController.getCreateThread);
router.get('/findDuplicateTitle', threadController.getCheckDuplicate);
router.post('/addThread', isPrivate, addThreadValidation, threadController.postAddThread);

router.get('/thread/:id', threadController.getThread);
router.post('/deleteThread/:id', isPrivate, threadController.postDeleteThread);

router.get('/getEditThread/:id', isPrivate, threadController.getEditThread);
router.post('/postEditThread/:id', isPrivate, threadController.postEditThread)

router.get('/search', threadController.getSearchResult);

module.exports = router;