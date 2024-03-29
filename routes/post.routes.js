const Router = require('express')
const router = new Router()
const postController = require('../controller/post.controller')
const authMiddleware = require('../middleware/auth-middleware')

router.post('/post', postController.createPost)
router.put('/post/like', postController.incrementLike)
router.put('/post/dislike', postController.decrementLike)
router.get('/post', postController.getPost)

module.exports = router