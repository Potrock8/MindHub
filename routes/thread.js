const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController.js');
const { isPrivate, isThreadOwner } = require('../middlewares/checkAuth.js');
const { threadValidation } = require('../middlewares/validator.js');

router.get('/createThread', isPrivate, threadController.getCreateThread);
router.get('/findDuplicateTitle', threadController.getCheckDuplicate);
router.post('/addThread', isPrivate, threadValidation, threadController.postAddThread);

router.get('/thread/:id', threadController.getThread);
router.post('/deleteThread/:id', isPrivate, isThreadOwner, threadController.postDeleteThread);

router.get('/getEditThread/:id', isPrivate, isThreadOwner, threadController.getEditThread);
router.post('/postEditThread/:id', isPrivate, isThreadOwner, threadValidation, threadController.postEditThread)

router.get('/search', threadController.getSearchResult);

module.exports = router;