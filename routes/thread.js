const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController.js');
const { isPrivate } = require('../middlewares/checkAuth.js');
const { addThreadValidation } = require('../middlewares/validator.js');

router.get('/createThread', isPrivate, threadController.getCreateThread);
router.get('/findDuplicateTitle', isPrivate, threadController.getCheckDuplicate);
router.post('/addThread', isPrivate, addThreadValidation, threadController.postAddThread);

router.get('/thread/:title', threadController.getThread);

module.exports = router;