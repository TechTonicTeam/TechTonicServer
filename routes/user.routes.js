const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')

router.post('/user', userController.createUser)
router.put('/user', userController.setPictureUser)
router.get('/user:email', userController.getUser)

module.exports = router