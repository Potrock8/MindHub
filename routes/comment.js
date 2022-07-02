const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController.js');
const { isPrivate } = require('../middlewares/checkAuth.js');
//not sure
//router.get('comment/:_id', commentController.getComment);
router.post('/thread/:title/addComment', isPrivate, commentController.postAddComment);

module.exports = router;