const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController.js');
const { isPrivate, isSessionUser } = require('../middlewares/checkAuth.js');

router.get('/thread/:id/getEditComment/:commentid', isPrivate, commentController.getEditComment)
router.post('/thread/:id/addComment', isPrivate, commentController.postAddComment);
router.post('/thread/:id/postEditComment', isPrivate, commentController.postEditComment);
router.post('/thread/:id/deleteComment', isPrivate, commentController.postDeleteComment)

module.exports = router;