const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController.js');
const { isPrivate, isCommentOwner } = require('../middlewares/checkAuth.js');
const { commentValidation } = require('../middlewares/validator.js');

router.get('/thread/:id/getEditComment/:commentid', isPrivate, isCommentOwner, commentController.getEditComment)
router.post('/thread/:id/addComment', isPrivate, commentController.postAddComment);
router.post('/thread/:id/postEditComment', isPrivate, isCommentOwner, commentValidation, commentController.postEditComment);
router.post('/thread/:id/deleteComment', isPrivate, isCommentOwner, commentValidation, commentController.postDeleteComment)

module.exports = router;