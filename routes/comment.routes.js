const Router = require('express')
const router = new Router()
const CommentController = require('../controller/comment.controller')

router.get('/comment', CommentController.getComment)
router.get('/comment', CommentController.createComment)
router.put('/comment/like', CommentController.likeComment)
router.put('/comment/dislike', CommentController.dislikeComment)

module.exports = router